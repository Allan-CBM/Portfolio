# Allan Martins — Portfolio

Personal portfolio of **Allan Martins**, graphic and production designer in Florianópolis, Brazil.
Bilingual (`/en` and `/pt`), deployed on Vercel. There is no CMS: all content lives in plain files in this repo.
Projects live on Behance; the site links to them from one large card.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · GSAP + ScrollTrigger · Lenis · React Three Fiber · Vercel.

---

## How to change content

Edit the file, check it locally if you can (`npm run dev`), then commit and push. Vercel redeploys automatically in about a minute.

Every text exists in **English and Portuguese**. `src/i18n/dictionaries/pt.ts` is type-checked against `en.ts`, so if you add a key to one file and forget the other, `npm run typecheck` (and the Vercel build) fails and tells you where.

| What | File | Notes |
|---|---|---|
| About text (the "Read more" paragraphs) | `src/i18n/dictionaries/en.ts` and `pt.ts` → `about.body` | One string per paragraph. The first ~7 lines show before "Read more". |
| About heading, pillars | same files → `about.heading`, `about.pillars` | |
| Stats (+10 / 3 / +10) | same files → `about.stats` | `value` is the number, `prefix`/`suffix` wrap it, `label` is the caption. |
| Education | same files → `about.educationItems` | Also update `education` in `src/lib/site.ts` (used for search engines). |
| Toolkit chips | `src/lib/site.ts` → `tools` | Tool names are the same in both languages. |
| AI Toolkit chips | `src/lib/site.ts` → `aiTools` | |
| Capabilities (the big scrolling rows) | dictionaries → `skills.groups` | One `{ title, items }` per row. |
| Services | dictionaries → `services.items` | `{ title, description }` per row. |
| Process steps | dictionaries → `process.steps` | |
| Hero text, buttons, all other labels | dictionaries → `hero`, `nav`, `contact`, `footer`… | |
| Experience entries | `src/content/experience.ts` | Most recent first. Dates are `"YYYY-MM"`. Each text has `en` and `pt`. `intro` and `tools` are optional. |
| Behance / LinkedIn links, contact email | `src/content/siteSettings.ts` | Leave `email` empty to hide every email link. |
| Page title and description (Google, link previews) | dictionaries → `meta` | |
| Profile photo | `public/images/allan.jpg` | Replace the file, same name. Portrait, face near the top (the card crops to 4:5 from the top). |
| Behance card background | `public/images/behance-profile.jpg` | Replace the file, same name. About 1.9:1; the right side stays the most visible. |

Asking an AI assistant works well too: point it at this table and at `CLAUDE.md`.

---

## Run locally

Requires Node 20.11+.

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /en or /pt)
```

Before pushing anything beyond a text change:

```bash
npm run typecheck
npm run lint
npm run build
```

## Environment variables

None are required. Optional:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL used in canonical links, Open Graph, the sitemap and JSON-LD. Set it when a custom domain is added. Without it, Vercel's production domain is used automatically. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Fallback contact email (currently unused; `siteSettings.ts` wins). |

Copy `.env.example` to `.env.local` for local overrides. Never commit `.env.local`.

## Deploy

The repo is connected to Vercel: every push to `main` deploys to production, every other branch gets a preview URL. When a custom domain is added in Vercel (Settings → Domains), set `NEXT_PUBLIC_SITE_URL` to it and redeploy.

## Folder structure

```
src/
├── content/            # experience.ts, siteSettings.ts (typed content, en + pt)
├── i18n/dictionaries/  # en.ts, pt.ts: all site copy
├── lib/                # site.ts (tools, links, site URL), seo.ts, fonts.ts, utils.ts
├── app/(site)/[locale]/ # layout, home page, 404, Open Graph image
├── components/
│   ├── sections/       # Hero, About, FeaturedWork (Behance card), Skills, Experience, Services, Process, Contact
│   ├── layout/         # Navbar, footer, preloader, locale switcher
│   ├── providers/      # App (Lenis, motion), leaving-site warning, page transition
│   ├── motion/         # Reveal, TextReveal, Magnetic, Parallax, Counter, Marquee, Cursor…
│   ├── three/          # 3D hero object
│   └── ui/             # Button, ExpandableText, ExternalLink…
└── middleware.ts       # / → /en or /pt (cookie, then browser language)
public/images/          # allan.jpg, behance-profile.jpg
```

## Behaviour notes

- **Behance links** (the Featured card, the footer and the Contact section) show a "you're about to leave this site" warning first. Visitors can tick "Don't ask me again" (stored in their browser). LinkedIn, email and internal links never show it. To make another link use the warning, render it with `ExternalLink` from `src/components/ui/external-link.tsx`.
- Everything animated respects the visitor's "reduce motion" setting.
