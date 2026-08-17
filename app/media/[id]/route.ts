import { getMediaBucket } from "@/db";
import { getMediaRecord } from "@/lib/cms";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const media = await getMediaRecord(id);
    if (!media) return notFound();

    const object = await getMediaBucket().get(media.objectKey);
    if (!object) return notFound();

    const etag = object.httpEtag;
    if (etag && request.headers.get("if-none-match") === etag) {
      return new Response(null, { status: 304, headers: publicMediaHeaders(media, etag) });
    }

    return new Response(object.body, {
      status: 200,
      headers: publicMediaHeaders(media, etag),
    });
  } catch (error) {
    console.error("Unable to serve media", error);
    return new Response("Media unavailable", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}

function publicMediaHeaders(
  media: { contentType: string; size: number },
  etag?: string,
): Headers {
  const headers = new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Length": String(media.size),
    "Content-Type": media.contentType,
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
  });
  if (etag) headers.set("ETag", etag);
  return headers;
}

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: {
      "Cache-Control": "public, max-age=60",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
