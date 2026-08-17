import Link from "next/link";

import "./admin.css";

export const metadata = {
  title: "Website editing guide — Avokodo",
  description: "How authorized Avokodo editors update the static website through GitHub.",
  robots: {
    index: false,
    follow: false,
  },
};

const repositoryUrl = "https://github.com/mikezzx2009/Avokodo";
const contentEditorUrl = `${repositoryUrl}/edit/main/lib/content.ts`;
const assetLibraryUrl = `${repositoryUrl}/tree/main/public/upwork-assets`;
const assetUploadUrl = `${repositoryUrl}/upload/main/public/upwork-assets`;
const deploymentUrl = `${repositoryUrl}/actions`;
const historyUrl = `${repositoryUrl}/commits/main`;

const editingSteps = [
  {
    number: "01",
    title: "Edit the website copy",
    description:
      "Open the content file in GitHub and change only the quoted text or link values inside PUBLISHED_SITE_CONTENT. Keep field names, IDs, commas and brackets unchanged.",
    href: contentEditorUrl,
    linkLabel: "Open content editor",
  },
  {
    number: "02",
    title: "Replace or add imagery",
    description:
      "Upload JPG, WebP or PNG files to the portfolio asset folder. For a direct replacement, keep the existing filename; for a new image, also update its /upwork-assets/… path and alternative text in the content file.",
    href: assetUploadUrl,
    linkLabel: "Upload an image",
  },
  {
    number: "03",
    title: "Commit the change",
    description:
      "Add a short description of what changed, then commit to main. GitHub records every version, so an earlier result can be restored from the commit history.",
    href: historyUrl,
    linkLabel: "View change history",
  },
  {
    number: "04",
    title: "Watch it publish",
    description:
      "A successful commit to main starts the Pages workflow automatically. Wait for the green check before reviewing the live website; deployment normally takes a few minutes.",
    href: deploymentUrl,
    linkLabel: "View deployment status",
  },
] as const;

export default function AdminPage() {
  return (
    <main className="github-guide">
      <header className="github-guide__topbar">
        <Link className="github-guide__wordmark" href="/" aria-label="Avokodo home">
          avokodo
        </Link>
        <span>Website editing guide</span>
        <Link className="github-guide__back" href="/">
          View website <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="github-guide__hero" aria-labelledby="guide-title">
        <p className="github-guide__eyebrow">GitHub-managed website</p>
        <h1 id="guide-title">Update Avokodo from one source of truth.</h1>
        <div className="github-guide__intro">
          <p>
            This static website has no separate login, database or content API.
            Authorized collaborators make updates in GitHub, where every edit is
            reviewed, recorded and published automatically.
          </p>
          <a
            className="github-guide__primary"
            href={contentEditorUrl}
            target="_blank"
            rel="noreferrer"
          >
            Edit website content <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="github-guide__notice" aria-labelledby="access-note-title">
        <div className="github-guide__notice-mark" aria-hidden="true">
          i
        </div>
        <div>
          <h2 id="access-note-title">GitHub controls editing access</h2>
          <p>
            This guide is public, but changes require write permission to the
            Avokodo repository. GitHub will ask you to sign in when you open an
            editing link.
          </p>
        </div>
      </section>

      <section className="github-guide__workflow" aria-labelledby="workflow-title">
        <header>
          <p className="github-guide__eyebrow">Editing workflow</p>
          <h2 id="workflow-title">Four steps from edit to live.</h2>
        </header>
        <ol className="github-guide__steps">
          {editingSteps.map((step) => (
            <li key={step.number}>
              <article>
                <span className="github-guide__step-number" aria-hidden="true">
                  {step.number}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <a href={step.href} target="_blank" rel="noreferrer">
                    {step.linkLabel} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="github-guide__resources" aria-labelledby="resources-title">
        <div>
          <p className="github-guide__eyebrow">Quick links</p>
          <h2 id="resources-title">Everything in one repository.</h2>
        </div>
        <nav aria-label="GitHub editing resources">
          <a href={contentEditorUrl} target="_blank" rel="noreferrer">
            <span>Content file</span>
            <small>Edit text, links and project details</small>
            <b aria-hidden="true">↗</b>
          </a>
          <a href={assetLibraryUrl} target="_blank" rel="noreferrer">
            <span>Image library</span>
            <small>Review current product and portfolio assets</small>
            <b aria-hidden="true">↗</b>
          </a>
          <a href={deploymentUrl} target="_blank" rel="noreferrer">
            <span>Deployments</span>
            <small>Check the latest build and publishing status</small>
            <b aria-hidden="true">↗</b>
          </a>
        </nav>
      </section>

      <footer className="github-guide__footer">
        <p>
          Need to undo something? Open the change history, select the last good
          version and revert the unwanted commit.
        </p>
        <a href={historyUrl} target="_blank" rel="noreferrer">
          Open change history <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </main>
  );
}
