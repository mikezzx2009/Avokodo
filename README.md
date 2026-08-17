# Avokodo company website

Avokodo's public presentation site and lightweight content studio. The visual
direction uses an original editorial layout inspired by the pacing and restraint
of Morrama without copying its brand assets, project images, or client work.

## What is included

- Responsive public company page with hero, work, services, about, process, and
  contact sections.
- Structured content stored in Cloudflare D1 with separate draft and published
  versions.
- `/admin` content studio protected by Sign in with ChatGPT and a server-side
  administrator allowlist.
- Editable navigation, copy, calls to action, services, projects, process steps,
  footer links, and hero/about/project imagery.
- JPEG, PNG, WebP, and AVIF uploads stored in R2, limited to 10 MB and checked by
  file signature.
- GitHub Actions build verification in `.github/workflows/ci.yml`.
- Cloudflare Worker-compatible Vinext output for Sites hosting and custom-domain
  routing.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

The public site runs locally with the configured D1 and R2 development bindings.
The dispatch-owned ChatGPT sign-in flow is completed on a deployed Sites URL.

Useful checks:

```bash
npm run lint
npm test
```

## Content and administrator access

The first request initializes the D1 tables and seeds safe default content. Set
the hosted `ADMIN_EMAILS` environment value to one or more comma-separated
ChatGPT account email addresses. A signed-in account must appear in this
allowlist (or the `admins` D1 table) before `/admin` or any write API will allow
changes.

Editors can save a draft without affecting the public website, preview the
editing state in the content studio, and publish explicitly when it is ready.
Revision checks prevent an older browser tab from overwriting a newer edit.

The initial contact button links to the supplied Upwork profile:

<https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1>

## Hosting and domain

GitHub is the canonical source and CI surface. The runtime should be Sites/
Cloudflare Worker rather than GitHub Pages because authentication, D1, R2, and
server-side authorization are required. After publishing, connect the exact
custom hostname in Sites and add the returned CNAME or apex A records plus the
validation records at the domain's DNS provider.

Logical production resources are declared in `.openai/hosting.json`:

- D1: `DB`
- R2: `MEDIA`

Runtime values such as `ADMIN_EMAILS` belong in Sites environment settings and
must not be committed to Git.
