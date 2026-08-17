import {
  adminErrorResponse,
  assertSameOrigin,
  privateJsonHeaders,
  requireAdmin,
} from "@/lib/admin-auth";
import {
  CmsRevisionConflictError,
  getCmsSnapshot,
  saveDraft,
} from "@/lib/cms";
import { SiteContentValidationError } from "@/lib/content";

const MAX_REQUEST_CHARACTERS = 100_000;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return Response.json(await getCmsSnapshot(), { headers: privateJsonHeaders() });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdmin();
    const body = await readJsonObject(request);
    exactRequestKeys(body, ["content", "revision"]);
    const revision = positiveRevision(body.revision);
    const snapshot = await saveDraft(body.content, revision);
    return Response.json(snapshot, { headers: privateJsonHeaders() });
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
    if (error instanceof SiteContentValidationError) {
      return Response.json(
        { error: "The site content is invalid.", code: "INVALID_CONTENT", issues: error.issues },
        { status: 400, headers: privateJsonHeaders() },
      );
    }
    if (error instanceof RequestPayloadError || error instanceof TypeError) {
      return Response.json(
        { error: error.message, code: "INVALID_REQUEST" },
        { status: error instanceof RequestPayloadError ? error.status : 400, headers: privateJsonHeaders() },
      );
    }
    return adminErrorResponse(error);
  }
}

class RequestPayloadError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 413 | 415,
  ) {
    super(message);
    this.name = "RequestPayloadError";
  }
}

async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new RequestPayloadError("Content-Type must be application/json.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_CHARACTERS) {
    throw new RequestPayloadError("The request body is too large.", 413);
  }

  const text = await request.text();
  if (text.length > MAX_REQUEST_CHARACTERS) {
    throw new RequestPayloadError("The request body is too large.", 413);
  }

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new RequestPayloadError("The request body is not valid JSON.", 400);
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new RequestPayloadError("The request body must be a JSON object.", 400);
  }
  return value as Record<string, unknown>;
}

function exactRequestKeys(value: Record<string, unknown>, expected: string[]) {
  const keys = Object.keys(value);
  if (keys.length !== expected.length || expected.some((key) => !(key in value))) {
    throw new RequestPayloadError(`Only ${expected.join(" and ")} are accepted.`, 400);
  }
}

function positiveRevision(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) {
    throw new TypeError("revision must be a positive integer");
  }
  return value;
}
