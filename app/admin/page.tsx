import Link from "next/link";

import {
  chatGPTSignOutPath,
  requireChatGPTUser,
} from "@/app/chatgpt-auth";
import {
  AdminAuthError,
  requireAdmin,
  type AdminIdentity,
} from "@/lib/admin-auth";

import AdminEditor from "./AdminEditor";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Content studio — Avokodo",
  description: "Manage the content published on the Avokodo website.",
  robots: {
    index: false,
    follow: false,
  },
};

function AccessDenied({ email }: { email: string }) {
  return (
    <main className="admin-access-shell">
      <section className="admin-access-card" aria-labelledby="access-title">
        <Link className="admin-wordmark" href="/" aria-label="Avokodo home">
          avokodo
        </Link>
        <p className="admin-kicker">Content studio</p>
        <h1 id="access-title">This account does not have editing access.</h1>
        <p className="admin-access-copy">
          You are signed in as <strong>{email}</strong>. Ask an Avokodo
          administrator to add this address to the editor allowlist, or sign in
          with a different account.
        </p>
        <div className="admin-access-actions">
          <a
            className="admin-button admin-button--primary"
            href={chatGPTSignOutPath("/admin")}
          >
            Sign out
          </a>
          <Link className="admin-button admin-button--quiet" href="/">
            Return to website
          </Link>
        </div>
        <p className="admin-access-note">
          Your sign-in was successful; only authorized editors can change
          website content.
        </p>
      </section>
    </main>
  );
}

export default async function AdminPage() {
  const signedInUser = await requireChatGPTUser("/admin");
  let admin: AdminIdentity;

  try {
    admin = await requireAdmin(signedInUser);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return <AccessDenied email={signedInUser.email} />;
    }

    throw error;
  }

  return (
    <AdminEditor
      admin={{
        displayName: admin.displayName,
        email: admin.email,
      }}
      signOutHref={chatGPTSignOutPath("/")}
    />
  );
}
