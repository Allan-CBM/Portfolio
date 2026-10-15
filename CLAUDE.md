# CLAUDE.md

Portfolio platform for **Allan Martins** — Graphic Designer, Product Designer and Creative Technologist based in Florianópolis, Brazil. More than one person works on this repo, from different machines; the team communicates in **Portuguese (pt-BR)**, so reply in Portuguese unless asked otherwise. Code, comments and commit messages are in English.

Setup, environment variables and deployment (Vercel + Sanity) are documented in [README.md](README.md). Don't duplicate them here.

## Commands

```bash
npm run dev         # dev server on http://localhost:3000 (redirects to /en or /pt)
npm run build       # production build — run before pushing anything non-trivial
npm run typecheck   # tsc --noEmit
npm run lint
npx sanity schema validate   # after editing anything in src/sanity/schemaTypes
```

There are no automated tests. Verify changes with `typecheck` + `lint` + `build`, and look at the affected pages in a browser (desktop and ~375px mobile, both `/en` and `/pt`).

## Stack

Next.js 15 (App Router, React 19) · TypeScript strict · Tailwind CSS 3 + shadcn/ui · Framer Motion · GSAP/ScrollTrigger (`@gsap/react`) · Lenis · React Three Fiber + drei · Sanity Studio v3 embedded at `/studio` via `next-sanity` 9 (Live Content API, Presentation, Draft Mode).

## Architecture

- `src/app/(site)/[locale]/` — public site. Each locale segment has its **own root layout** (`<html lang>` per locale); `src/app/(studio)/` is a separate root layout for the Studio. There is intentionally no `src/app/layout.tsx`.
- `src/middleware.ts` — redirects unprefixed paths to `/en` or `/pt` (cookie `NEXT_LOCALE`, then `Accept-Language`).
- `src/i18n/dictionaries/{en,pt}.ts` — all UI copy and the fallback content (hero, about, services, process, skills). `pt` is typed against `en` — add every new key to both files.
- `src/sanity/` — `schemaTypes/` (documents, objects, page-builder `blocks/`), `lib/queries.ts` (GROQ), `lib/fetch.ts`, `lib/localize.ts`, `types.ts`, `structure.ts`, `plugins/dashboard/`, `presentation/resolve.ts`.
- `src/components/` — `sections/` (homepage sections), `blocks/` (page-builder renderers), `project/`, `journal/`, `motion/` (reusable animation primitives), `layout/`, `media/`, `three/`, `ui/` (shadcn).

## Content model — rules that matter

- **Everything editable lives in Sanity.** Never hardcode projects, testimonials or posts. Homepage sections use Sanity data when present and fall back to the dictionaries.
- **Never invent content.** No placeholder testimonials, fake metrics, made-up job titles or dates. Known gaps: there is no contact email yet (the email link is hidden until one is set in Site Settings or `NEXT_PUBLIC_CONTACT_EMAIL`), and the experience timeline only knows the company names (Otus Engenharia, ADVB/SC, TDBusiness, Glamour Beauty Show, Pregão de Guerra); roles and dates are to be filled in the Studio by the owners. The testimonials section only renders when at least one testimonial exists.
- **Localization is field-level:** translatable fields use the `localeString` / `localeText` / `localeBlockContent` object types (`{ en, pt }`). Queries fetch the raw objects; `localize()` in `src/sanity/lib/localize.ts` resolves them to the request locale with English fallback. Components and `types.ts` therefore work with plain strings. New translatable fields must use these types.
- **Page builder:** a project's `pageBuilder` array renders through `components/blocks/block-renderer.tsx`. A new block needs (1) a schema in `schemaTypes/blocks/index.ts` added to `pageBlocks` and the insert-menu groups, (2) image/file expansion in the `pageBuilder` projection in `queries.ts` if it has media, (3) a type in `types.ts` added to the `PageBlock` union, (4) a renderer + a `case` in the renderer. When `pageBuilder` is empty the default case-study template (`project/case-study.tsx`) is used.
- **Images** expand their asset in GROQ via the `image` fragment (`asset->{_id, url, metadata{lqip, dimensions}}`) and render with `components/media/sanity-image.tsx` (custom `next/image` loader on the Sanity CDN).

## Gotchas (already solved — don't regress)

- **Stega / Visual Editing:** in Draft Mode, strings carry invisible source-map characters. Any string used as logic (class lookups, enum keys, colors, emails) must be listed in `NON_VISUAL_KEYS` in `src/sanity/lib/client.ts`, or those lookups break during live preview.
- **Page transition curtain** (`components/providers/page-transition.tsx`) decides whether to animate **once per mount** via `useState`. Reading the module flag on every render made the curtain cover the page after `router.refresh()` (which `SanityLive` triggers on content updates).
- **Server can be started from the parent folder:** the in-app preview runs `next dev allan-martins-portfolio` from one directory up. That's why `postcss.config.mjs` passes an absolute Tailwind config path and `tailwind.config.ts` uses `content: { relative: true, ... }`. Keep both.
- **Google Fonts behind TLS inspection:** on the owner's machine, Node needs `--use-system-ca` to download fonts (`node --use-system-ca node_modules/next/dist/bin/next dev`). Without it Next falls back to system fonts with a warning — not a code bug.
- **Builds without Sanity credentials must keep working:** `fetchSanity`/`fetchStatic` return `null` when unconfigured or on error, and every page handles `null`.
- `generateStaticParams`, `generateMetadata` and the sitemap use `fetchStatic` (plain client, published perspective, no stega). Pages use `fetchSanity` (live, draft-aware). Calling `fetchSanity` in `generateStaticParams` fails because it reads `draftMode()`.
- Tailwind: `duration-[…]` arbitrary values are ambiguous with `tailwindcss-animate`; use `[transition-duration:…]`.
- The repo lives in OneDrive on one machine; keep `node_modules` and `.next` out of git (already in `.gitignore`).

## Design system

- Colors are CSS variables in `src/app/globals.css` (`--background #050505`, `--card #0f0f0f`, `--border #202020`, `--foreground #fff`, `--muted #888`, `--accent #6EE7FF`, `--secondary #8B5CF6`), exposed as Tailwind colors. Use the tokens, never raw hex in components (exception: canvas/OG image code).
- Fonts: Space Grotesk (`font-display`, headings) and Inter (`font-sans`, body) via `next/font`.
- Type scale: `text-display-2xl … text-display-sm` in `tailwind.config.ts`. Small uppercase labels use the `.label` class.
- Motion: reuse `components/motion/*` (`TextReveal`, `Reveal`, `Stagger`/`StaggerList`, `Magnetic`, `Parallax`, `Counter`, `Marquee`). Easing `[0.16, 1, 0.3, 1]` for reveals, `[0.76, 0, 0.24, 1]` for curtains/menus. Everything must respect `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` is global; GSAP code uses `gsap.matchMedia`).
- Accessibility: keep visible focus states, real buttons/links, `aria-*` on custom widgets, and list semantics (`StaggerList`/`StaggerListItem` instead of divs inside `<ul>`).

## Workflow between collaborators

- Pull before starting work and commit in small, descriptive commits. Never commit `.env.local` or tokens.
- Content changes (texts, projects, images, testimonials) are made in the Studio (`/studio`), not in code.
