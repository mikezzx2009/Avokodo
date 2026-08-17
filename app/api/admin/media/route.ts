import {
  adminErrorResponse,
  assertSameOrigin,
  privateJsonHeaders,
  requireAdmin,
} from "@/lib/admin-auth";
import { createMediaRecord } from "@/lib/cms";
import { getMediaBucket } from "@/db";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_IMAGE_BYTES + 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let objectKey: string | null = null;
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();

    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.startsWith("multipart/form-data;")) {
      return mediaError("Upload one image as multipart form field “file”.", "INVALID_REQUEST", 415);
    }
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_BYTES) {
      return mediaError("Images must be 10 MB or smaller.", "FILE_TOO_LARGE", 413);
    }

    const form = await request.formData();
    const upload = form.get("file");
    if (!(upload instanceof File)) {
      return mediaError("The multipart field “file” must contain an image.", "INVALID_REQUEST", 400);
    }
    if (upload.size < 1 || upload.size > MAX_IMAGE_BYTES) {
      return mediaError("Images must be between 1 byte and 10 MB.", "FILE_TOO_LARGE", 413);
    }

    const normalizedType = upload.type.trim().toLowerCase();
    if (!ACCEPTED_IMAGE_TYPES.has(normalizedType)) {
      return mediaError("Use a JPEG, PNG, WebP, or AVIF image.", "UNSUPPORTED_MEDIA_TYPE", 415);
    }
    if (!(await signatureMatches(upload, normalizedType))) {
      return mediaError(
        "The file contents do not match the selected image format.",
        "INVALID_IMAGE",
        400,
      );
    }

    const id = crypto.randomUUID();
    objectKey = `images/${id}`;
    const filename = safeFilename(upload.name);
    const bucket = getMediaBucket();
    await bucket.put(objectKey, upload.stream(), {
      httpMetadata: { contentType: normalizedType },
      customMetadata: {
        uploadedBy: admin.userId.slice(0, 128),
        originalFilename: filename,
      },
    });

    let media;
    try {
      media = await createMediaRecord({
        id,
        objectKey,
        filename,
        contentType: normalizedType,
        size: upload.size,
        uploadedBy: admin.userId,
      });
    } catch (error) {
      await bucket.delete(objectKey);
      objectKey = null;
      throw error;
    }
    objectKey = null;

    return Response.json(
      {
        media: {
          id: media.id,
          url: `/media/${media.id}`,
          filename: media.filename,
          contentType: media.contentType,
          size: media.size,
          createdAt: media.createdAt,
        },
      },
      { status: 201, headers: privateJsonHeaders() },
    );
  } catch (error) {
    // Only compensate when the object was written but metadata did not make it
    // to D1. The inner catch normally handles this; this covers later failures.
    if (objectKey) {
      try {
        await getMediaBucket().delete(objectKey);
      } catch (cleanupError) {
        console.error("Unable to remove incomplete media upload", cleanupError);
      }
    }
    return adminErrorResponse(error);
  }
}

function mediaError(message: string, code: string, status: number) {
  return Response.json(
    { error: message, code },
    { status, headers: privateJsonHeaders() },
  );
}

function safeFilename(value: string): string {
  const basename = value.split(/[\\/]/).pop() ?? "image";
  const cleaned = [...basename]
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code !== 127 && character !== "<" && character !== ">";
    })
    .join("")
    .trim()
    .slice(0, 200);
  return cleaned || "image";
}

async function signatureMatches(file: File, contentType: string): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  if (contentType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === "image/png") {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= png.length && png.every((value, index) => bytes[index] === value);
  }
  if (contentType === "image/webp") {
    return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP";
  }
  if (contentType === "image/avif") {
    if (ascii(bytes, 4, 8) !== "ftyp") return false;
    for (let offset = 8; offset + 4 <= bytes.length; offset += 4) {
      const brand = ascii(bytes, offset, offset + 4);
      if (brand === "avif" || brand === "avis") return true;
    }
  }
  return false;
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  if (bytes.length < end) return "";
  return String.fromCharCode(...bytes.slice(start, end));
}
