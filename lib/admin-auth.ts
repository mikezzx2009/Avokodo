import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";
import { getAdminEmailsSetting, getD1 } from "@/db";
import { ensureCmsDatabase } from "@/lib/cms";

export type AdminIdentity = {
  userId: string;
  email: string;
  displayName: string;
  fullName: string | null;
  source: "environment" | "database";
};

export type AdminAccess =
  | { user: ChatGPTUser; authorized: true; admin: AdminIdentity; reason: null }
  | {
      user: ChatGPTUser | null;
      authorized: false;
      admin: null;
      reason: "unauthenticated" | "forbidden";
    };

export class AdminAuthError extends Error {
  readonly status: 401 | 403;
  readonly code: "UNAUTHENTICATED" | "FORBIDDEN";

  constructor(status: 401 | 403, code: "UNAUTHENTICATED" | "FORBIDDEN", message: string) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
    this.code = code;
  }
}

export class SameOriginError extends Error {
  readonly status = 403;
  readonly code = "BAD_ORIGIN";

  constructor() {
    super("This request must come from the same site.");
    this.name = "SameOriginError";
  }
}

export async function requireAdmin(user?: ChatGPTUser | null): Promise<AdminIdentity> {
  const currentUser = user === undefined ? await getChatGPTUser() : user;
  if (!currentUser) {
    throw new AdminAuthError(401, "UNAUTHENTICATED", "Sign in with ChatGPT to continue.");
  }

  const normalizedEmail = normalizeEmail(currentUser.email);
  const configuredAdmins = parseConfiguredAdmins(getAdminEmailsSetting());
  if (configuredAdmins.has(normalizedEmail)) {
    return toAdminIdentity(currentUser, "environment");
  }

  await ensureCmsDatabase();
  const row = await getD1()
    .prepare("SELECT email FROM admins WHERE email = ? OR lower(email) = ? LIMIT 1")
    .bind(normalizedEmail, normalizedEmail)
    .first<{ email: string }>();

  if (!row) {
    throw new AdminAuthError(
      403,
      "FORBIDDEN",
      "Your signed-in account is not on the Avokodo administrator allowlist.",
    );
  }

  return toAdminIdentity(currentUser, "database");
}

export async function getAdminAccess(user?: ChatGPTUser | null): Promise<AdminAccess> {
  const currentUser = user === undefined ? await getChatGPTUser() : user;
  if (!currentUser) {
    return { user: null, authorized: false, admin: null, reason: "unauthenticated" };
  }

  try {
    const admin = await requireAdmin(currentUser);
    return { user: currentUser, authorized: true, admin, reason: null };
  } catch (error) {
    if (error instanceof AdminAuthError && error.status === 403) {
      return { user: currentUser, authorized: false, admin: null, reason: "forbidden" };
    }
    throw error;
  }
}

/**
 * Mutating CMS endpoints call this before reading a request body. Browsers send
 * Origin for these requests; Referer is accepted as a conservative fallback.
 */
export function assertSameOrigin(request: Request): void {
  const expectedOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin) {
    if (parseOrigin(origin) === expectedOrigin) return;
    throw new SameOriginError();
  }

  const referer = request.headers.get("referer");
  if (referer && parseOrigin(referer) === expectedOrigin) return;
  throw new SameOriginError();
}

export function adminErrorResponse(error: unknown): Response {
  if (error instanceof AdminAuthError || error instanceof SameOriginError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.status, headers: privateJsonHeaders() },
    );
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  console.error("Admin API error", error);
  return Response.json(
    { error: message, code: "INTERNAL_ERROR" },
    { status: 500, headers: privateJsonHeaders() },
  );
}

export function privateJsonHeaders(): HeadersInit {
  return {
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  };
}

function parseConfiguredAdmins(value: string): Set<string> {
  return new Set(
    value
      .split(/[\s,;]+/)
      .map(normalizeEmail)
      .filter((email) => email.length > 0 && email.length <= 254),
  );
}

function normalizeEmail(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function toAdminIdentity(
  user: ChatGPTUser,
  source: AdminIdentity["source"],
): AdminIdentity {
  return {
    userId: user.userId,
    email: user.email,
    displayName: user.displayName,
    fullName: user.fullName,
    source,
  };
}

function parseOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}
