# Avokodo company website

Avokodo's public company presentation site. The site is a fully static Next.js
export hosted with GitHub Pages at <https://www.avokodotech.com>.

## What is included

- Responsive company page with work, services, about, process, and contact sections.
- Checked-in English content in `lib/content.ts`.
- Product and portfolio imagery in `public/upwork-assets/`.
- Static `/admin/` editing guide that links authorized collaborators to GitHub.
- Automatic build and deployment through GitHub Actions.
- Custom domain declaration in `public/CNAME`.

There is no separate application login, database, upload API, Cloudflare Worker,
or other runtime service. GitHub repository permissions control who can edit the
website, and Git history records every change.

## Edit website content

1. Open `lib/content.ts` on GitHub and edit values inside
   `PUBLISHED_SITE_CONTENT`.
2. To replace an existing image, upload a JPG or WebP with the same filename to
   `public/upwork-assets/`. For a new filename, also update the matching image
   path and alternative text in the content file.
3. Commit the change to `main`.
4. Check the **Build and deploy GitHub Pages** workflow. A successful run
   publishes the new version automatically.

The public `/admin/` page contains direct links to these editing locations.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm test
```

`npm run build` writes the deployable static site to `out/`.

## Domain

GitHub Pages uses `www.avokodotech.com` as the custom domain. The apex domain
`avokodotech.com` should use GitHub Pages' published A records so GitHub can
redirect it to `www` over HTTPS.
