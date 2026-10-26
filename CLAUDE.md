# CLAUDE.md

Portfolio of **Allan Martins**, graphic and production designer in Florianópolis, Brazil. The repo belongs to Allan (github.com/Allan-CBM/Portfolio); his father Sérgio sometimes helps. Neither is a developer: they edit content by changing plain files (or asking an AI), then push so Vercel redeploys.

Reply in the language the person writes in (Allan usually writes in English, Sérgio in Portuguese). Code, comments and commit messages are in English. Explain things in plain words.

The content map (which file holds which text or image) is in [README.md](README.md). Don't duplicate it here; keep it up to date when you move content.

## Commands

```bash
npm run dev         # http://localhost:3000 (redirects to /en or /pt)
npm run typecheck   # tsc --noEmit
npm run lint
npm run build       # run before pushing anything non-trivial
```

No automated tests. Verify with typecheck + lint + build, then look at the affected section in a browser: desktop and ~375px mobile, both `/en` and `/pt`.

## Architecture

- **No CMS, no tokens.** Content lives in `src/i18n/dictionaries/{en,pt}.ts` (all copy), `src/content/` (typed content: `experience.ts`, `siteSettings.ts`, `types.ts` with `Localized<T>`), `src/lib/site.ts` (tools, AI tools, education for JSON-LD, links, `siteUrl`) and `public/images/`.
- `pt` is typed against `en` (`Dictionary`). Every new key goes in both files. Content in `src/content/` uses `Localized<T>` = `{ en, pt }`, both required.
- `src/app/(site)/[locale]/` — the only route: each locale has its own root layout (`<html lang>`); there is intentionally no `src/app/layout.tsx`. The site is a single home page plus 404, sitemap, robots, manifest and the generated Open Graph image.
- `src/middleware.ts` — redirects unprefixed paths to `/en` or `/pt` (cookie `NEXT_LOCALE`, then `Accept-Language`).
- `src/components/sections/` — home sections in order: Hero, About, FeaturedWork (one Behance card), Skills (marquee), Experience (accordion), Services (accordion), Process, Contact.
- `src/components/providers/leave-site-provider.tsx` + `ui/external-link.tsx` — the leaving-site warning. Use `ExternalLink` **only for Behance**. LinkedIn is the main contact channel and must never show the warning.
- Build must succeed with no environment variables. `siteUrl` resolves `NEXT_PUBLIC_SITE_URL` → `https://$VERCEL_PROJECT_PRODUCTION_URL` → `https://$VERCEL_URL` → `http://localhost:3000`.

## Content rules

- **Never invent content**: no fake metrics, testimonials, job titles, dates, clients or tools. Use only what Allan provides.
- There is no contact email on purpose (LinkedIn is the channel) and no Instagram. Testimonials, projects pages and the journal were removed on purpose; don't bring them back unless asked.
- Experience: most recent first, dates as `"YYYY-MM"`, displayed with `formatMonthYear`. All accordion items start closed.

## Gotchas (already solved; don't regress)

- **Server started from the parent folder:** the in-app preview runs `next dev allan-martins-portfolio` from one directory up. That's why `postcss.config.mjs` passes an absolute Tailwind config path and `tailwind.config.ts` uses `content: { relative: true, ... }`. Keep both.
- **Google Fonts behind TLS inspection:** on Sérgio's machine Node needs `--use-system-ca` (`NODE_OPTIONS=--use-system-ca`). Without it Next falls back to system fonts with a warning; not a code bug.
- `next build` and `next dev` share `.next/`: stop the dev server before building, or delete `.next` if typecheck complains about deleted routes in `.next/types`.
- **Page transition curtain** (`providers/page-transition.tsx`) decides whether to animate once per mount via `useState`. Don't read the module flag on every render.
- Tailwind: `duration-[…]` arbitrary values are ambiguous with `tailwindcss-animate`; use `[transition-duration:…]`.
- Scroll locking (menu, leaving-site overlay) must call Lenis `stopScroll()`/`startScroll()` from `useApp()`, not only `overflow: hidden`.

## Design system

- Colors are CSS variables in `src/app/globals.css` (`--background #050505`, `--card #0f0f0f`, `--border #202020`, `--foreground #fff`, `--muted #888`, `--accent #6EE7FF`, `--secondary #8B5CF6`), exposed as Tailwind colors. Use the tokens, never raw hex in components (exception: the OG image).
- Fonts: Space Grotesk (`font-display`) and Inter (`font-sans`) via `next/font`. Type scale `text-display-2xl … text-display-sm`; small uppercase labels use `.label`.
- Reusable effects in `globals.css`: `.liquid-glass` (frosted panel), `.progressive-blur` (stacked masked blur layers), `.text-outline`, `.text-gradient`, `.link-underline`.
- Motion: reuse `components/motion/*`. Easing `[0.16, 1, 0.3, 1]` for reveals, `[0.76, 0, 0.24, 1]` for curtains/menus. Everything respects `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` globally, `motion-safe:` for CSS hover motion, `gsap.matchMedia` for GSAP).
- Accessibility: visible focus states, real buttons/links, `aria-expanded`/`aria-controls` on accordions, list semantics.

## Workflow

- Pull before starting, commit in small descriptive commits, push to `main` to deploy. Never commit `.env.local` or tokens.
