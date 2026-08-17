"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/content";

type ContentEnvelope = {
  draft: SiteContent;
  published: SiteContent | null;
  revision: number;
  updatedAt: string | null;
  publishedAt: string | null;
};

type MediaResponse = {
  media: {
    id: string;
    url: string;
    filename: string;
    contentType: string;
    size: number;
    createdAt: string;
  };
};

type ImageRef = NonNullable<SiteContent["hero"]["image"]>;
type LinkItem = SiteContent["navigation"][number];

type EditorProps = {
  admin: {
    displayName: string;
    email: string;
  };
  signOutHref: string;
};

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: "text" | "email" | "url";
};

type ImageEditorProps = {
  id: string;
  label: string;
  image: ImageRef | null;
  busy: boolean;
  onChange: (image: ImageRef | null) => void;
  onUpload: (file: File) => Promise<void>;
};

const sectionLinks = [
  ["#brand", "Brand"],
  ["#navigation", "Navigation"],
  ["#hero", "Hero"],
  ["#about", "About"],
  ["#services", "Services"],
  ["#work", "Work"],
  ["#process", "Process"],
  ["#contact", "Contact"],
  ["#footer", "Footer"],
] as const;

function copyContent(value: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(value)) as SiteContent;
}

function makeId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}-${random}`;
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const destination = index + direction;
  if (destination < 0 || destination >= items.length) return items;

  const next = [...items];
  [next[index], next[destination]] = [next[destination], next[index]];
  return next;
}

function humanDate(value: string | null): string {
  if (!value) return "Not yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function responseMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: string;
      issues?: string[];
    };
    if (body.error) {
      const details = body.issues?.slice(0, 3).join("; ");
      return details ? `${body.error} ${details}.` : body.error;
    }
  } catch {
    // The generic status message below is more useful than a JSON parse error.
  }

  return `Request failed (${response.status}). Please try again.`;
}

function TextField({
  id,
  label,
  value,
  onChange,
  description,
  placeholder,
  multiline = false,
  rows = 4,
  type = "text",
}: TextFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      {description ? <p id={descriptionId}>{description}</p> : null}
      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={rows}
          placeholder={placeholder}
          aria-describedby={descriptionId}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          aria-describedby={descriptionId}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      )}
    </div>
  );
}

function EditorSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-section" id={id} aria-labelledby={`${id}-title`}>
      <header className="admin-section__header">
        <p>{eyebrow}</p>
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          <span>{description}</span>
        </div>
      </header>
      <div className="admin-section__body">{children}</div>
    </section>
  );
}

function ItemActions({
  label,
  index,
  count,
  canRemove = true,
  onMove,
  onRemove,
}: {
  label: string;
  index: number;
  count: number;
  canRemove?: boolean;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="admin-item-actions">
      <button
        type="button"
        className="admin-icon-button"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label={`Move ${label} up`}
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        className="admin-icon-button"
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        aria-label={`Move ${label} down`}
        title="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        className="admin-icon-button admin-icon-button--danger"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={`Remove ${label}`}
        title={canRemove ? "Remove" : "At least one item is required"}
      >
        ×
      </button>
    </div>
  );
}

function StringListEditor({
  id,
  label,
  values,
  addLabel,
  multiline = false,
  minItems = 0,
  maxItems = Number.POSITIVE_INFINITY,
  onChange,
}: {
  id: string;
  label: string;
  values: string[];
  addLabel: string;
  multiline?: boolean;
  minItems?: number;
  maxItems?: number;
  onChange: (values: string[]) => void;
}) {
  return (
    <fieldset className="admin-subfieldset">
      <legend>{label}</legend>
      <div className="admin-string-list">
        {values.map((value, index) => (
          <div className="admin-string-row" key={`${id}-${index}`}>
            <label className="admin-sr-only" htmlFor={`${id}-${index}`}>
              {label} {index + 1}
            </label>
            {multiline ? (
              <textarea
                id={`${id}-${index}`}
                rows={4}
                value={value}
                onChange={(event) => {
                  const next = [...values];
                  next[index] = event.currentTarget.value;
                  onChange(next);
                }}
              />
            ) : (
              <input
                id={`${id}-${index}`}
                value={value}
                onChange={(event) => {
                  const next = [...values];
                  next[index] = event.currentTarget.value;
                  onChange(next);
                }}
              />
            )}
            <div className="admin-string-actions">
              <button
                type="button"
                className="admin-mini-button"
                disabled={index === 0}
                onClick={() => onChange(moveItem(values, index, -1))}
                aria-label={`Move ${label.toLowerCase()} ${index + 1} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-mini-button"
                disabled={index === values.length - 1}
                onClick={() => onChange(moveItem(values, index, 1))}
                aria-label={`Move ${label.toLowerCase()} ${index + 1} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-mini-button admin-mini-button--danger"
                disabled={values.length <= minItems}
                onClick={() =>
                  onChange(values.filter((_, itemIndex) => itemIndex !== index))
                }
                aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="admin-add-button"
        disabled={values.length >= maxItems}
        onClick={() => onChange([...values, ""])}
      >
        <span aria-hidden="true">+</span> {addLabel}
      </button>
    </fieldset>
  );
}

function LinkListEditor({
  id,
  label,
  items,
  maxItems = 12,
  onChange,
}: {
  id: string;
  label: string;
  items: LinkItem[];
  maxItems?: number;
  onChange: (items: LinkItem[]) => void;
}) {
  return (
    <fieldset className="admin-subfieldset">
      <legend>{label}</legend>
      <div className="admin-card-list">
        {items.map((item, index) => (
          <article className="admin-compact-card" key={`${id}-${index}`}>
            <div className="admin-card-heading">
              <strong>{item.label || `Link ${index + 1}`}</strong>
              <ItemActions
                label={`${label} link ${index + 1}`}
                index={index}
                count={items.length}
                onMove={(direction) => onChange(moveItem(items, index, direction))}
                onRemove={() =>
                  onChange(items.filter((_, itemIndex) => itemIndex !== index))
                }
              />
            </div>
            <div className="admin-field-grid admin-field-grid--two">
              <TextField
                id={`${id}-${index}-label`}
                label="Label"
                value={item.label}
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...item, label: value };
                  onChange(next);
                }}
              />
              <TextField
                id={`${id}-${index}-href`}
                label="Link"
                value={item.href}
                placeholder="#work or https://…"
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...item, href: value };
                  onChange(next);
                }}
              />
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="admin-add-button"
        disabled={items.length >= maxItems}
        onClick={() => onChange([...items, { label: "New link", href: "#" }])}
      >
        <span aria-hidden="true">+</span> Add link
      </button>
    </fieldset>
  );
}

function ImageEditor({
  id,
  label,
  image,
  busy,
  onChange,
  onUpload,
}: ImageEditorProps) {
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) void onUpload(file);
    event.currentTarget.value = "";
  }

  return (
    <fieldset className="admin-image-editor">
      <legend>{label}</legend>
      <div className="admin-image-editor__layout">
        <div className="admin-image-preview">
          {image?.url ? (
            // Images are user-managed and can originate from the configured R2 domain.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={image.alt || ""} />
          ) : (
            <div className="admin-image-placeholder" aria-hidden="true">
              <span>AV</span>
              <small>No image</small>
            </div>
          )}
        </div>
        <div className="admin-image-controls">
          <div className="admin-field">
            <label htmlFor={`${id}-file`}>Upload image</label>
            <p>JPG, PNG, WebP or AVIF, up to 10 MB. Use a wide image for project cards.</p>
            <input
              className="admin-file-input"
              id={`${id}-file`}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={busy}
              onChange={handleFile}
            />
          </div>
          {busy ? (
            <p className="admin-uploading" role="status">
              <span aria-hidden="true" /> Uploading image…
            </p>
          ) : null}
          {image ? (
            <>
              <TextField
                id={`${id}-alt`}
                label="Alternative text"
                description="Describe the image for visitors using a screen reader."
                value={image.alt}
                onChange={(alt) => onChange({ ...image, alt })}
              />
              <p className="admin-media-path">Stored securely as {image.url}</p>
              <button
                type="button"
                className="admin-text-button admin-text-button--danger"
                onClick={() => onChange(null)}
              >
                Remove image
              </button>
            </>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}

function OptionalLinkEditor({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: LinkItem | null;
  onChange: (value: LinkItem | null) => void;
}) {
  if (!value) {
    return (
      <div className="admin-optional-row">
        <span>{label}</span>
        <button
          type="button"
          className="admin-add-button"
          onClick={() => onChange({ label: "Learn more", href: "#work" })}
        >
          <span aria-hidden="true">+</span> Add secondary action
        </button>
      </div>
    );
  }

  return (
    <fieldset className="admin-subfieldset">
      <legend>{label}</legend>
      <div className="admin-subfieldset-heading admin-subfieldset-heading--end">
        <button
          type="button"
          className="admin-text-button admin-text-button--danger"
          onClick={() => onChange(null)}
        >
          Remove
        </button>
      </div>
      <div className="admin-field-grid admin-field-grid--two">
        <TextField
          id={`${id}-label`}
          label="Label"
          value={value.label}
          onChange={(labelValue) => onChange({ ...value, label: labelValue })}
        />
        <TextField
          id={`${id}-href`}
          label="Link"
          value={value.href}
          onChange={(href) => onChange({ ...value, href })}
        />
      </div>
    </fieldset>
  );
}

export default function AdminEditor({ admin, signOutHref }: EditorProps) {
  const statusId = useId();
  const [content, setContent] = useState<SiteContent>(() =>
    copyContent(DEFAULT_SITE_CONTENT),
  );
  const [envelope, setEnvelope] = useState<ContentEnvelope | null>(null);
  const [conflict, setConflict] = useState<ContentEnvelope | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const response = await fetch("/api/admin/content", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error(await responseMessage(response));

        const nextEnvelope = (await response.json()) as ContentEnvelope;
        if (!active) return;

        setEnvelope(nextEnvelope);
        setContent(copyContent(nextEnvelope.draft));
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The website content could not be loaded.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadContent();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [dirty]);

  function edit(mutator: (draft: SiteContent) => void) {
    setContent((current) => {
      const draft = copyContent(current);
      mutator(draft);
      return draft;
    });
    setDirty(true);
    setError(null);
    setNotice(null);
  }

  function applyEnvelope(nextEnvelope: ContentEnvelope) {
    setEnvelope(nextEnvelope);
    setContent(copyContent(nextEnvelope.draft));
    setDirty(false);
    setConflict(null);
  }

  async function saveDraft() {
    if (!envelope || saving || publishing) return;

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, revision: envelope.revision }),
      });

      if (response.status === 409) {
        const body = (await response.json()) as {
          error?: string;
          current?: ContentEnvelope;
        };
        if (body.current) setConflict(body.current);
        throw new Error(
          body.error ||
            "Someone saved a newer version. Review the conflict before continuing.",
        );
      }
      if (!response.ok) throw new Error(await responseMessage(response));

      const nextEnvelope = (await response.json()) as ContentEnvelope;
      applyEnvelope(nextEnvelope);
      setNotice("Draft saved. It is not live until you publish it.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The draft could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (!envelope || saving || publishing) return;
    if (dirty) {
      setError("Save this draft before publishing it.");
      setNotice(null);
      return;
    }

    setPublishing(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revision: envelope.revision }),
      });
      if (response.status === 409) {
        const body = (await response.json()) as {
          error?: string;
          current?: ContentEnvelope;
        };
        if (body.current) setConflict(body.current);
        throw new Error(
          body.error ||
            "A newer draft exists. Load it before publishing again.",
        );
      }
      if (!response.ok) throw new Error(await responseMessage(response));

      const nextEnvelope = (await response.json()) as ContentEnvelope;
      applyEnvelope(nextEnvelope);
      setNotice("Published. The public website now uses this version.");
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "The website could not be published.",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function uploadImage(
    file: File,
    target: string,
    onUploaded: (image: ImageRef) => void,
  ) {
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to upload.");
      return;
    }

    setUploading(target);
    setError(null);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(await responseMessage(response));

      const { media } = (await response.json()) as MediaResponse;
      const fallbackAlt =
        file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .slice(0, 300) ||
        "Uploaded image";
      onUploaded({ id: media.id, url: media.url, alt: fallbackAlt });
      setNotice("Image uploaded. Save the draft to keep this change.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded.",
      );
    } finally {
      setUploading(null);
    }
  }

  const hasUnpublishedChanges =
    Boolean(envelope?.published) &&
    JSON.stringify(envelope?.draft) !== JSON.stringify(envelope?.published);
  const isWorking = loading || saving || publishing || uploading !== null;

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <Link className="admin-wordmark admin-wordmark--light" href="/">
            avokodo
          </Link>
          <span>Content studio</span>
        </div>
        <div className="admin-account">
          <span className="admin-account__avatar" aria-hidden="true">
            {admin.displayName.slice(0, 1).toUpperCase()}
          </span>
          <span className="admin-account__identity">
            <strong>{admin.displayName}</strong>
            <small>{admin.email}</small>
          </span>
          <a href={signOutHref}>Sign out</a>
        </div>
      </header>

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div>
            <p className="admin-sidebar__label">Website content</p>
            <nav aria-label="Editor sections">
              {sectionLinks.map(([href, label], index) => (
                <a href={href} key={href}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="admin-sidebar__meta">
            <span>Draft revision {envelope?.revision ?? "—"}</span>
            <span>Saved {humanDate(envelope?.updatedAt ?? null)}</span>
            <span>Published {humanDate(envelope?.publishedAt ?? null)}</span>
            <Link href="/" target="_blank" rel="noreferrer">
              View website <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-page-heading">
            <div>
              <p>Avokodo website</p>
              <h1>Edit content</h1>
            </div>
            <div className="admin-state-badge" data-dirty={dirty || hasUnpublishedChanges}>
              <span aria-hidden="true" />
              {dirty
                ? "Unsaved changes"
                : hasUnpublishedChanges
                  ? "Draft differs from live"
                  : envelope?.published
                    ? "Live version is current"
                    : "Not published yet"}
            </div>
          </div>

          <div id={statusId} className="admin-announcements" aria-live="polite">
            {loading ? (
              <div className="admin-alert admin-alert--loading">
                <span aria-hidden="true" /> Loading website content…
              </div>
            ) : null}
            {error ? (
              <div className="admin-alert admin-alert--error" role="alert">
                <strong>Something needs attention.</strong>
                <span>{error}</span>
              </div>
            ) : null}
            {notice ? (
              <div className="admin-alert admin-alert--success" role="status">
                <strong>Done.</strong>
                <span>{notice}</span>
              </div>
            ) : null}
            {conflict ? (
              <div className="admin-conflict" role="alert">
                <div>
                  <strong>A newer draft is available</strong>
                  <p>
                    Loading it will replace your unsaved edits. It was saved {" "}
                    {humanDate(conflict.updatedAt)}.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-button admin-button--quiet"
                  onClick={() => {
                    applyEnvelope(conflict);
                    setError(null);
                    setNotice("The latest saved draft is now loaded.");
                  }}
                >
                  Load latest draft
                </button>
              </div>
            ) : null}
          </div>

          <form
            className="admin-form"
            aria-describedby={statusId}
            onSubmit={(event) => {
              event.preventDefault();
              void saveDraft();
            }}
          >
            <EditorSection
              id="brand"
              eyebrow="01 / Identity"
              title="Brand basics"
              description="The company name and contact details used throughout the site."
            >
              <div className="admin-field-grid admin-field-grid--two">
                <TextField
                  id="site-name"
                  label="Company name"
                  value={content.site.name}
                  onChange={(value) => edit((draft) => { draft.site.name = value; })}
                />
                <TextField
                  id="site-email"
                  label="Company email"
                  type="email"
                  description="Optional. Leave empty when email is not a public contact method."
                  value={content.site.email ?? ""}
                  onChange={(value) => edit((draft) => { draft.site.email = value || null; })}
                />
              </div>
              <TextField
                id="site-tagline"
                label="Tagline"
                value={content.site.tagline}
                onChange={(value) => edit((draft) => { draft.site.tagline = value; })}
              />
            </EditorSection>

            <EditorSection
              id="navigation"
              eyebrow="02 / Wayfinding"
              title="Navigation"
              description="Links shown in the website header."
            >
              <LinkListEditor
                id="navigation-link"
                label="Header links"
                items={content.navigation}
                onChange={(items) => edit((draft) => { draft.navigation = items; })}
              />
            </EditorSection>

            <EditorSection
              id="hero"
              eyebrow="03 / First impression"
              title="Hero"
              description="The opening statement visitors see at the top of the homepage."
            >
              <TextField
                id="hero-eyebrow"
                label="Eyebrow"
                value={content.hero.eyebrow}
                onChange={(value) => edit((draft) => { draft.hero.eyebrow = value; })}
              />
              <TextField
                id="hero-title"
                label="Headline"
                value={content.hero.title}
                multiline
                rows={3}
                onChange={(value) => edit((draft) => { draft.hero.title = value; })}
              />
              <TextField
                id="hero-description"
                label="Introduction"
                value={content.hero.description}
                multiline
                onChange={(value) => edit((draft) => { draft.hero.description = value; })}
              />
              <fieldset className="admin-subfieldset">
                <legend>Primary action</legend>
                <div className="admin-field-grid admin-field-grid--two">
                  <TextField
                    id="hero-primary-label"
                    label="Label"
                    value={content.hero.primaryCta.label}
                    onChange={(value) => edit((draft) => { draft.hero.primaryCta.label = value; })}
                  />
                  <TextField
                    id="hero-primary-href"
                    label="Link"
                    value={content.hero.primaryCta.href}
                    onChange={(value) => edit((draft) => { draft.hero.primaryCta.href = value; })}
                  />
                </div>
              </fieldset>
              <OptionalLinkEditor
                id="hero-secondary"
                label="Secondary action"
                value={content.hero.secondaryCta}
                onChange={(value) => edit((draft) => { draft.hero.secondaryCta = value; })}
              />
              <ImageEditor
                id="hero-image"
                label="Hero image"
                image={content.hero.image}
                busy={uploading === "hero"}
                onChange={(image) => edit((draft) => { draft.hero.image = image; })}
                onUpload={(file) =>
                  uploadImage(file, "hero", (image) =>
                    edit((draft) => { draft.hero.image = image; }),
                  )
                }
              />
            </EditorSection>

            <EditorSection
              id="about"
              eyebrow="04 / Story"
              title="About"
              description="Explain who Avokodo is and how the studio approaches its work."
            >
              <div className="admin-field-grid admin-field-grid--two">
                <TextField
                  id="about-eyebrow"
                  label="Eyebrow"
                  value={content.about.eyebrow}
                  onChange={(value) => edit((draft) => { draft.about.eyebrow = value; })}
                />
                <TextField
                  id="about-title"
                  label="Headline"
                  value={content.about.title}
                  onChange={(value) => edit((draft) => { draft.about.title = value; })}
                />
              </div>
              <StringListEditor
                id="about-paragraph"
                label="Paragraphs"
                values={content.about.paragraphs}
                addLabel="Add paragraph"
                multiline
                minItems={1}
                maxItems={8}
                onChange={(values) => edit((draft) => { draft.about.paragraphs = values; })}
              />
              <ImageEditor
                id="about-image"
                label="About image"
                image={content.about.image}
                busy={uploading === "about"}
                onChange={(image) => edit((draft) => { draft.about.image = image; })}
                onUpload={(file) =>
                  uploadImage(file, "about", (image) =>
                    edit((draft) => { draft.about.image = image; }),
                  )
                }
              />
            </EditorSection>

            <EditorSection
              id="services"
              eyebrow="05 / Offer"
              title="Services"
              description="Add, remove or reorder the services Avokodo offers."
            >
              <div className="admin-field-grid admin-field-grid--two">
                <TextField
                  id="services-eyebrow"
                  label="Eyebrow"
                  value={content.services.eyebrow}
                  onChange={(value) => edit((draft) => { draft.services.eyebrow = value; })}
                />
                <TextField
                  id="services-title"
                  label="Headline"
                  value={content.services.title}
                  onChange={(value) => edit((draft) => { draft.services.title = value; })}
                />
              </div>
              <TextField
                id="services-intro"
                label="Introduction"
                value={content.services.intro}
                multiline
                onChange={(value) => edit((draft) => { draft.services.intro = value; })}
              />
              <div className="admin-card-list">
                {content.services.items.map((service, index) => (
                  <article className="admin-item-card" key={service.id}>
                    <div className="admin-card-heading">
                      <div>
                        <span className="admin-card-index">{service.number || String(index + 1).padStart(2, "0")}</span>
                        <strong>{service.title || `Service ${index + 1}`}</strong>
                      </div>
                      <ItemActions
                        label={service.title || `service ${index + 1}`}
                        index={index}
                        count={content.services.items.length}
                        canRemove={content.services.items.length > 1}
                        onMove={(direction) =>
                          edit((draft) => {
                            draft.services.items = moveItem(draft.services.items, index, direction);
                          })
                        }
                        onRemove={() =>
                          edit((draft) => {
                            draft.services.items.splice(index, 1);
                          })
                        }
                      />
                    </div>
                    <div className="admin-field-grid admin-field-grid--two">
                      <TextField
                        id={`service-${service.id}-number`}
                        label="Number"
                        value={service.number}
                        onChange={(value) => edit((draft) => { draft.services.items[index].number = value; })}
                      />
                      <TextField
                        id={`service-${service.id}-title`}
                        label="Title"
                        value={service.title}
                        onChange={(value) => edit((draft) => { draft.services.items[index].title = value; })}
                      />
                    </div>
                    <TextField
                      id={`service-${service.id}-description`}
                      label="Description"
                      value={service.description}
                      multiline
                      onChange={(value) => edit((draft) => { draft.services.items[index].description = value; })}
                    />
                    <StringListEditor
                      id={`service-${service.id}-capability`}
                      label="Capabilities"
                      values={service.capabilities}
                      addLabel="Add capability"
                      maxItems={12}
                      onChange={(values) => edit((draft) => { draft.services.items[index].capabilities = values; })}
                    />
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="admin-add-button admin-add-button--large"
                disabled={content.services.items.length >= 12}
                onClick={() =>
                  edit((draft) => {
                    draft.services.items.push({
                      id: makeId("service"),
                      number: String(draft.services.items.length + 1).padStart(2, "0"),
                      title: "New service",
                      description: "",
                      capabilities: [],
                    });
                  })
                }
              >
                <span aria-hidden="true">+</span> Add service
              </button>
            </EditorSection>

            <EditorSection
              id="work"
              eyebrow="06 / Proof"
              title="Selected work"
              description="Manage the case studies and project images featured on the site."
            >
              <div className="admin-field-grid admin-field-grid--two">
                <TextField
                  id="work-eyebrow"
                  label="Eyebrow"
                  value={content.work.eyebrow}
                  onChange={(value) => edit((draft) => { draft.work.eyebrow = value; })}
                />
                <TextField
                  id="work-title"
                  label="Headline"
                  value={content.work.title}
                  onChange={(value) => edit((draft) => { draft.work.title = value; })}
                />
              </div>
              <TextField
                id="work-intro"
                label="Introduction"
                value={content.work.intro}
                multiline
                onChange={(value) => edit((draft) => { draft.work.intro = value; })}
              />
              <div className="admin-card-list">
                {content.work.items.map((project, index) => (
                  <article className="admin-item-card admin-item-card--project" key={project.id}>
                    <div className="admin-card-heading">
                      <div>
                        <span className="admin-card-index">{String(index + 1).padStart(2, "0")}</span>
                        <strong>{project.title || `Project ${index + 1}`}</strong>
                      </div>
                      <ItemActions
                        label={project.title || `project ${index + 1}`}
                        index={index}
                        count={content.work.items.length}
                        onMove={(direction) =>
                          edit((draft) => {
                            draft.work.items = moveItem(draft.work.items, index, direction);
                          })
                        }
                        onRemove={() =>
                          edit((draft) => {
                            draft.work.items.splice(index, 1);
                          })
                        }
                      />
                    </div>
                    <div className="admin-field-grid admin-field-grid--two">
                      <TextField
                        id={`project-${project.id}-title`}
                        label="Project title"
                        value={project.title}
                        onChange={(value) => edit((draft) => { draft.work.items[index].title = value; })}
                      />
                      <TextField
                        id={`project-${project.id}-category`}
                        label="Category"
                        value={project.category}
                        onChange={(value) => edit((draft) => { draft.work.items[index].category = value; })}
                      />
                    </div>
                    <TextField
                      id={`project-${project.id}-description`}
                      label="Description"
                      value={project.description}
                      multiline
                      onChange={(value) => edit((draft) => { draft.work.items[index].description = value; })}
                    />
                    <TextField
                      id={`project-${project.id}-href`}
                      label="Project link"
                      description="Optional. Leave empty when no public case study is available."
                      value={project.href ?? ""}
                      onChange={(value) => edit((draft) => { draft.work.items[index].href = value || null; })}
                    />
                    <ImageEditor
                      id={`project-${project.id}-image`}
                      label="Project image"
                      image={project.image}
                      busy={uploading === `project-${project.id}`}
                      onChange={(image) => edit((draft) => { draft.work.items[index].image = image; })}
                      onUpload={(file) =>
                        uploadImage(file, `project-${project.id}`, (image) =>
                          edit((draft) => {
                            const targetProject = draft.work.items.find(
                              (item) => item.id === project.id,
                            );
                            if (targetProject) targetProject.image = image;
                          }),
                        )
                      }
                    />
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="admin-add-button admin-add-button--large"
                disabled={content.work.items.length >= 16}
                onClick={() =>
                  edit((draft) => {
                    draft.work.items.push({
                      id: makeId("project"),
                      title: "New project",
                      category: "",
                      description: "",
                      image: null,
                      href: null,
                    });
                  })
                }
              >
                <span aria-hidden="true">+</span> Add project
              </button>
            </EditorSection>

            <EditorSection
              id="process"
              eyebrow="07 / Method"
              title="Process"
              description="Describe the steps clients can expect when working with Avokodo."
            >
              <div className="admin-field-grid admin-field-grid--two">
                <TextField
                  id="process-eyebrow"
                  label="Eyebrow"
                  value={content.process.eyebrow}
                  onChange={(value) => edit((draft) => { draft.process.eyebrow = value; })}
                />
                <TextField
                  id="process-title"
                  label="Headline"
                  value={content.process.title}
                  onChange={(value) => edit((draft) => { draft.process.title = value; })}
                />
              </div>
              <TextField
                id="process-intro"
                label="Introduction"
                value={content.process.intro}
                multiline
                onChange={(value) => edit((draft) => { draft.process.intro = value; })}
              />
              <div className="admin-card-list">
                {content.process.steps.map((step, index) => (
                  <article className="admin-compact-card" key={step.id}>
                    <div className="admin-card-heading">
                      <div>
                        <span className="admin-card-index">{step.number}</span>
                        <strong>{step.title || `Step ${index + 1}`}</strong>
                      </div>
                      <ItemActions
                        label={step.title || `step ${index + 1}`}
                        index={index}
                        count={content.process.steps.length}
                        canRemove={content.process.steps.length > 1}
                        onMove={(direction) =>
                          edit((draft) => {
                            draft.process.steps = moveItem(draft.process.steps, index, direction);
                          })
                        }
                        onRemove={() =>
                          edit((draft) => {
                            draft.process.steps.splice(index, 1);
                          })
                        }
                      />
                    </div>
                    <div className="admin-field-grid admin-field-grid--two">
                      <TextField
                        id={`process-${step.id}-number`}
                        label="Number"
                        value={step.number}
                        onChange={(value) => edit((draft) => { draft.process.steps[index].number = value; })}
                      />
                      <TextField
                        id={`process-${step.id}-title`}
                        label="Title"
                        value={step.title}
                        onChange={(value) => edit((draft) => { draft.process.steps[index].title = value; })}
                      />
                    </div>
                    <TextField
                      id={`process-${step.id}-description`}
                      label="Description"
                      value={step.description}
                      multiline
                      onChange={(value) => edit((draft) => { draft.process.steps[index].description = value; })}
                    />
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="admin-add-button admin-add-button--large"
                disabled={content.process.steps.length >= 10}
                onClick={() =>
                  edit((draft) => {
                    draft.process.steps.push({
                      id: makeId("step"),
                      number: String(draft.process.steps.length + 1).padStart(2, "0"),
                      title: "New step",
                      description: "",
                    });
                  })
                }
              >
                <span aria-hidden="true">+</span> Add process step
              </button>
            </EditorSection>

            <EditorSection
              id="contact"
              eyebrow="08 / Conversion"
              title="Contact"
              description="The final invitation and email address shown to prospective clients."
            >
              <div className="admin-field-grid admin-field-grid--two">
                <TextField
                  id="contact-eyebrow"
                  label="Eyebrow"
                  value={content.contact.eyebrow}
                  onChange={(value) => edit((draft) => { draft.contact.eyebrow = value; })}
                />
                <TextField
                  id="contact-email"
                  label="Contact email"
                  type="email"
                  description="Optional. Leave empty when the contact button goes elsewhere."
                  value={content.contact.email ?? ""}
                  onChange={(value) => edit((draft) => { draft.contact.email = value || null; })}
                />
              </div>
              <TextField
                id="contact-title"
                label="Headline"
                value={content.contact.title}
                multiline
                rows={3}
                onChange={(value) => edit((draft) => { draft.contact.title = value; })}
              />
              <TextField
                id="contact-description"
                label="Description"
                value={content.contact.description}
                multiline
                onChange={(value) => edit((draft) => { draft.contact.description = value; })}
              />
              <TextField
                id="contact-cta"
                label="Button label"
                value={content.contact.ctaLabel}
                onChange={(value) => edit((draft) => { draft.contact.ctaLabel = value; })}
              />
              <TextField
                id="contact-cta-href"
                label="Button link"
                description="Use the public contact destination, such as the company Upwork profile."
                value={content.contact.ctaHref}
                onChange={(value) => edit((draft) => { draft.contact.ctaHref = value; })}
              />
            </EditorSection>

            <EditorSection
              id="footer"
              eyebrow="09 / Sign-off"
              title="Footer"
              description="Closing statement, utility links and copyright line."
            >
              <TextField
                id="footer-tagline"
                label="Footer tagline"
                value={content.footer.tagline}
                multiline
                rows={3}
                onChange={(value) => edit((draft) => { draft.footer.tagline = value; })}
              />
              <TextField
                id="footer-copyright"
                label="Copyright"
                value={content.footer.copyright}
                onChange={(value) => edit((draft) => { draft.footer.copyright = value; })}
              />
              <LinkListEditor
                id="footer-link"
                label="Footer links"
                items={content.footer.links}
                onChange={(items) => edit((draft) => { draft.footer.links = items; })}
              />
            </EditorSection>

            <div className="admin-save-dock" aria-label="Save and publish controls">
              <div>
                <strong>
                  {dirty ? "You have unsaved changes" : "All changes are saved"}
                </strong>
                <span>
                  {dirty
                    ? "Save your draft before publishing."
                    : `Draft revision ${envelope?.revision ?? "—"}`}
                </span>
              </div>
              <div className="admin-save-dock__actions">
                <button
                  type="submit"
                  className="admin-button admin-button--quiet"
                  disabled={!envelope || !dirty || isWorking}
                >
                  {saving ? "Saving…" : "Save draft"}
                </button>
                <button
                  type="button"
                  className="admin-button admin-button--primary"
                  disabled={!envelope || dirty || isWorking}
                  onClick={() => void publish()}
                >
                  {publishing ? "Publishing…" : "Publish website"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
