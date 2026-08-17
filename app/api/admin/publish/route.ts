import {
  adminErrorResponse,
  assertSameOrigin,
  privateJsonHeaders,
  requireAdmin,
} from "@/lib/admin-auth";
import { CmsRevisionConflictError, publishDraft } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdmin();

    if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
      return Response.json(
        { error: "Content-Type must be application/json.", code: "INVALID_REQUEST" },
        { status: 415, headers: privateJsonHeaders() },
      );
    }
    const length = Number(request.headers.get("content-length"));
    if (Number.isFinite(length) && length > 1_000) {
      return Response.json(
        { error: "The request body is too large.", code: "INVALID_REQUEST" },
        { status: 413, headers: privateJsonHeaders() },
      );
    }

    const text = await request.text();
    if (text.length > 1_000) {
      return Response.json(
        { error: "The request body is too large.", code: "INVALID_REQUEST" },
        { status: 413, headers: privateJsonHeaders() },
      );
    }
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "The request body is not valid JSON.", code: "INVALID_REQUEST" },
        { status: 400, headers: privateJsonHeaders() },
      );
    }
    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body) ||
      Object.keys(body).length !== 1 ||
      !("revision" in body)
    ) {
      return Response.json(
        { error: "Only revision is accepted.", code: "INVALID_REQUEST" },
        { status: 400, headers: privateJsonHeaders() },
      );
    }

    const revision = (body as { revision?: unknown }).revision;
    if (typeof revision !== "number" || !Number.isSafeInteger(revision) || revision < 1) {
      return Response.json(
        { error: "revision must be a positive integer", code: "INVALID_REQUEST" },
        { status: 400, headers: privateJsonHeaders() },
      );
    }

    return Response.json(await publishDraft(revision), { headers: privateJsonHeaders() });
  } catch (error) {
    if (error instanceof CmsRevisionConflictError) {
      return Response.json(
        {
          error: error.message,
          code: "REVISION_CONFLICT",
          current: error.current,
        },
        { status: 409, headers: privateJsonHeaders() },
      );
    }
    return adminErrorResponse(error);
  }
}
