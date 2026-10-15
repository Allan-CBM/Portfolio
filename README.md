# Allan Martins — Portfolio Platform

Editorial, motion-driven portfolio for **Allan Martins** (Graphic Designer · Product Designer · Creative Technologist, Florianópolis — BR), with a fully CMS-managed case-study system.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · GSAP + ScrollTrigger · Lenis · Three.js / React Three Fiber · Lucide · Sanity Studio v3 (embedded at `/studio`) · Vercel.

---

## Features

- **Zero-code content**: projects, journal posts, testimonials, experience, services and site settings are all edited in Sanity.
- **Block-based page builder** (drag & drop) for case studies: Hero, Text, Rich Text, Image, Image Gallery, Video, Two Columns, Quote, Metrics, Process, Results, Call To Action, Divider, Full Width Media. Empty builder ⇒ automatic case-study template (Challenge → Research → Creative Process → Results → Gallery → Next Project).
- **Live preview**: Sanity Presentation tool + Draft Mode + Live Content API — edits stream to the page as you type, with click-to-edit overlays.
- **Bilingual** (`/en`, `/pt`): every content field has `en`/`pt` translations, resolved server-side with English fallback. Locale auto-detected from the browser and remembered in a cookie.
- **Studio dashboard**: total/featured projects, journal posts, drafts, recent posts and recent activity, updating in real time.
- **Motion system**: preloader, masked text reveals, magnetic buttons, parallax, GSAP image scaling and pinned process timeline, scroll progress, page-transition curtain, stagger reveals, custom cursor, marquee — all respecting `prefers-reduced-motion`.
- **Interactive 3D hero** (R3F), lazy-loaded on idle only on capable desktop devices; CSS fallback elsewhere.
- **SEO**: per-page metadata, hreflang alternates, OpenGraph/Twitter images (dynamic), `sitemap.xml`, `robots.txt`, web manifest, JSON-LD (Person, WebSite, CreativeWork, BreadcrumbList, Blog, BlogPosting).
- **Accessibility**: skip link, landmark structure, keyboard-operable menu/slider/accordions, visible focus states, ARIA labelling, high-contrast media query support.

---

## Folder structure

```
allan-martins-portfolio/
├── sanity.config.ts            # Studio config (structure, presentation, dashboard, vision)
├── sanity.cli.ts               # CLI config (deploy, dataset import)
├── sanity/seed/seed.ndjson     # Starter content: settings, experience timeline, services
├── next.config.ts · tailwind.config.ts · components.json · vercel.json · .env.example
└── src/
    ├── middleware.ts           # Locale detection & redirect (/ → /en | /pt)
    ├── app/
    │   ├── (site)/[locale]/    # Public site (root layout per locale)
    │   │   ├── layout.tsx      # Fonts, providers, nav/footer, SanityLive, VisualEditing
    │   │   ├── template.tsx    # Page transitions
    │   │   ├── page.tsx        # Home (all 12 sections)
    │   │   ├── projects/       # Archive + /projects/[slug] case studies
    │   │   ├── journal/        # Blog + /journal/[slug]
    │   │   ├── opengraph-image.tsx · twitter-image.tsx · not-found.tsx
    │   ├── (studio)/studio/[[...tool]]/   # Embedded Sanity Studio
    │   ├── api/draft-mode/{enable,disable} # Live preview
    │   ├── api/revalidate      # Optional webhook
    │   ├── sitemap.ts · robots.ts · manifest.ts · icon.svg · globals.css
    ├── components/
    │   ├── blocks/             # Page-builder block renderers
    │   ├── layout/             # Navbar, footer, preloader, locale switcher, preview bar
    │   ├── motion/             # TextReveal, Reveal/Stagger, Magnetic, Parallax, Counter, Marquee, Cursor…
    │   ├── sections/           # Hero, About, FeaturedWork, Skills, Experience, Services, Process, Testimonials, Contact
    │   ├── project/            # Project card/hero/case study/next project/archive
    │   ├── journal/ · media/ · seo/ · three/ · providers/ · ui/ (shadcn)
    ├── i18n/                   # Locale config + EN/PT dictionaries (UI copy)
    ├── lib/                    # utils, site constants, fonts, SEO helpers
    └── sanity/
        ├── env.ts · structure.ts · types.ts
        ├── lib/                # client, live, fetch, localize, image, queries (GROQ)
        ├── schemaTypes/        # documents/, objects/, blocks/
        ├── plugins/dashboard/  # Custom Studio dashboard tool
        └── presentation/       # Live-preview route resolution
```

---

## 1. Install

Requires **Node.js 20.11+**.

```bash
npm install
cp .env.example .env.local
```

> Tip: if the project lives inside a OneDrive/Dropbox folder, exclude `node_modules` and `.next` from syncing (or move the project out of the synced folder) — they contain tens of thousands of files.

## 2. Sanity setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) (or run `npx sanity init --env` and choose "create new project", dataset `production`).
2. Fill in `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (and the matching `SANITY_STUDIO_*` vars for the CLI).
   - `SANITY_API_READ_TOKEN` — Manage → **API → Tokens → Add API token** → permission **Viewer**. Required for live preview and Draft Mode.
3. Allow the site origin in CORS (needed by the embedded Studio and live updates):
   ```bash
   npx sanity cors add http://localhost:3000 --credentials
   ```
4. (Optional) Import the starter content — site settings, the experience timeline (Otus Engenharia, ADVB/SC, TDBusiness, Glamour Beauty Show, Pregão de Guerra) and the 7 services in EN/PT:
   ```bash
   npm run seed
   ```
5. Start the dev server and open the Studio:
   ```bash
   npm run dev
   ```
   - Site: http://localhost:3000 (redirects to `/en` or `/pt`)
   - Studio: http://localhost:3000/studio

### Content workflow

| Want to… | Do this in Studio |
|---|---|
| Add a project | **Content → Projects → +**. Fill Overview + Featured image, then compose the case study in **Page Builder** (or leave it empty and fill the **Case Study** tab for the automatic template). |
| Show it on the homepage | Toggle **Featured on homepage**. |
| Preview live | Open **Live Preview** (Presentation) — edits appear instantly; click any text on the page to jump to its field. |
| Add testimonials | **Testimonials → +** — the homepage slider appears automatically once one exists. |
| Journal | **Journal → +**, choose type: Article, Case Study, Design Note, AI Experiment. |
| Hero/About copy, counters, portrait, email, socials | **Site Settings**. Empty fields fall back to the built-in bilingual copy. |

Fields without a Portuguese translation fall back to English automatically.

## 3. Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | | Defaults to `2025-02-19` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | | Defaults to `/studio` |
| `SANITY_API_READ_TOKEN` | ✅ for preview | Viewer token (server-only) |
| `SANITY_REVALIDATE_SECRET` | | Secret for the optional webhook |
| `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` | CLI | Used by `sanity deploy` / `npm run seed` |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | | Site URL for Live Preview in a hosted (`*.sanity.studio`) Studio |
| `NEXT_PUBLIC_SITE_URL` | ✅ in prod | Canonical URL, e.g. `https://allanmartins.design` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | | Fallback email if not set in Site Settings |

Without Sanity credentials the site still builds and runs: CMS-driven sections show their empty states and the bilingual default copy is used.

## 4. Deploy to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project → Import** the repo (framework auto-detected as Next.js; `vercel.json` sets the São Paulo region `gru1`).
3. Add every variable from the table above under **Settings → Environment Variables** (Production + Preview). Set `NEXT_PUBLIC_SITE_URL` to the production domain.
4. Deploy. Then add the production origin to Sanity CORS:
   ```bash
   npx sanity cors add https://your-domain.com --credentials
   ```
5. (Recommended) Add a custom domain in Vercel → **Settings → Domains**.

Content updates go live instantly through the Live Content API — no redeploys needed.

### Optional: revalidation webhook

For immediate sitemap/static-params refresh after publishing, create a webhook in Sanity Manage → **API → Webhooks**:

- URL: `https://your-domain.com/api/revalidate`
- Trigger on: Create, Update, Delete · Filter: `_type in ["project", "post", "siteSettings", "testimonial", "experience", "service"]`
- Projection: `{ _type, "slug": slug.current }`
- Secret: the value of `SANITY_REVALIDATE_SECRET`

## 5. Deploy Sanity Studio

The Studio is already deployed with the site at `https://your-domain.com/studio`. Optionally also host it on Sanity's infrastructure:

```bash
npx sanity login
npm run studio:deploy        # → https://allan-martins.sanity.studio (change studioHost in sanity.cli.ts)
```

For the hosted Studio's **Live Preview** to load your site, set `SANITY_STUDIO_PREVIEW_ORIGIN=https://your-domain.com` in `.env` before running `npm run studio:deploy`. The site's `frame-ancestors` header (in `next.config.ts`) already allows `*.sanity.studio`.

Invite collaborators in Sanity Manage → **Members**.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` · `npm run typecheck` | Quality checks |
| `npm run seed` | Import starter content (skips docs that already exist) |
| `npm run studio:deploy` | Deploy hosted Studio |
| `npm run studio:cors` | Add `localhost:3000` to Sanity CORS |

## Performance notes

- Three.js is code-split and only loaded after `requestIdleCallback` on desktop with motion allowed; it pauses rendering off-screen.
- Images are served from Sanity's CDN through `next/image` with a custom loader (AVIF/WebP via `auto=format`, responsive `sizes`, LQIP blur placeholders).
- The preloader runs once per session; page transitions never hide content (no LCP penalty).
- Fonts via `next/font` (self-hosted, `display: swap`).
