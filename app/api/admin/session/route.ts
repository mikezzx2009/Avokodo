import { adminErrorResponse, privateJsonHeaders, requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await requireAdmin();
    return Response.json({ admin }, { headers: privateJsonHeaders() });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
