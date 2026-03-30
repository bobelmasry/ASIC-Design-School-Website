# AGENTS.md

## Mission
- Provide automation-friendly guardrails for the ASIC Design School Next.js repo.
- Capture the canonical commands, style rules, and missing pieces so agents take consistent actions.
- Explicitly call out absent infrastructure (tests, Cursor rules, etc.) to avoid guesswork.

## Repository Snapshot
- Next.js 16 App Router project rooted under `app/` with route segments per feature.
- TypeScript 5.7, `strict: true`, `noEmit`, bundler resolution, JSX runtime `react-jsx`.
- Aliases: `@/*` resolves to repo root (see `tsconfig.json`).
- Styling: Tailwind CSS v4 imported via `@import 'tailwindcss'` inside `app/globals.css` plus OKLCH tokens.
- Component system: shadcn-inspired wrappers in `components/ui`, Radix primitives, shared `cn` helper in `lib/utils.ts`.
- Fonts: Geist + Geist Mono through `next/font`, theme toggling handled by `components/theme-provider`.
- Data: Supabase JS client in `lib/supabase.ts`, placeholder arrays in `lib/placeholder-data.ts` for mock UI.
- Database ORM: Prisma is the canonical app data layer; use Supabase as PostgreSQL infrastructure to avoid vendor lock-in.
- Analytics: `@vercel/analytics` wired in `app/layout.tsx`.
- Images: `next.config.mjs` sets `images.unoptimized = true`; treat `<img>` usage accordingly.
- Cursor / Copilot rules: no `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` files exist; this document is the source of truth.

## Environment & Toolchain
- Node: use >=18.18 (Next 16 requirement) with 20.x LTS preferred.
- Package manager: use `pnpm` only. The lockfile source of truth is `pnpm-lock.yaml`.
- Env vars: `.env*` ignored; populate `.env.local` with Supabase creds (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and Prisma connection strings (`DATABASE_URL`, optional `SHADOW_DATABASE_URL`).
- Analytics/env toggles rely on `NEXT_PUBLIC_*`; never hardcode secrets.
- Tailwind 4 is configured via `postcss.config.mjs` (plugin `@tailwindcss/postcss` only).
- Build tolerates TS errors because `next.config.mjs` enables `typescript.ignoreBuildErrors`; run `npx tsc --noEmit` before merging sensitive work.
- Git hygiene: repo may be dirty; inspect with `git status` before edits and never revert user work.
- Fonts and CSS variables are defined once; reuse tokens instead of redefining colors.
- Supabase client must be imported from `@/lib/supabase`; do not instantiate ad-hoc clients.
- Global theme relies on `ThemeProvider` plus CSS custom properties; respect these when introducing new surfaces.

## Commands & Automation
- Install deps: `pnpm install`.
- Dev server: `pnpm dev` (Next on http://localhost:3000, watches env changes).
- Prod build: `pnpm build` (invokes `next build`; run `pnpm exec tsc --noEmit` beforehand for strict typing).
- Preview server: `pnpm start` (serves `.next` output, good for smoke testing before deploy).
- Lint everything: `pnpm lint` (Next-managed ESLint with core web vitals rules).
- Lint a file: `pnpm exec eslint path/to/file.tsx` (inherit Next config automatically).
- Format: no Prettier config committed; mirror existing style (single quotes, dangling commas avoided, width ~100).
- Type-check only: `pnpm exec tsc --noEmit` (recommended because Next build may skip errors).
- Prisma client: `pnpm prisma:generate`.
- Prisma local migration: `pnpm prisma:migrate`.
- Prisma deploy migration: `pnpm prisma:deploy`.
- Prisma Studio: `pnpm prisma:studio`.
- Analyze bundle: `next build --profile` when optimizing performance; summarize results in PR, do not commit artifacts.
- Dependency bumps: run `pnpm add package@version` then `pnpm lint` and update docs here if commands change.

## Testing Status & Guidance
- There is no configured test runner (no Jest/Vitest/Playwright configs, zero `*.test.*` files found).
- When asked to "run a test", state clearly that tests are absent and recommend adding Vitest/Playwright as next steps.
- For manual QA, run `npm run dev`, exercise affected routes, and document steps in PR descriptions.
- For manual QA, run `pnpm dev`, exercise affected routes, and document steps in PR descriptions.
- Keep components pure and deterministic to ease future test harness adoption.
- If you must prototype tests, add tooling under `devDependencies` and record the new scripts plus usage in this file.
- Until automated tests exist, rely on lint + type checks + manual verification for acceptance.

## Workflow Checklist For Agents
- Pull latest changes (`git pull`) before editing; branch per feature.
- Inspect `git status` to avoid overriding user modifications; never reset unrelated files.
- Run `pnpm lint` before handing work back; call out if it fails and why.
- For structural edits (routing, providers), touch `app/layout.tsx` carefully since it wires analytics and theming.
- Keep server components default; add `'use client'` only when hooks/state are required.
- Document new env vars in README/AGENTS; never commit `.env*` files.
- Reference this doc in PR bodies, especially when describing lint/type/test coverage.
- Update AGENTS.md whenever commands, style rules, or tooling evolve.

## Code Style: Imports & Modules
- Import order: Node/stdlib (rare) ➜ external packages ➜ absolute aliases (`@/...`) ➜ relative paths.
- Prefer named imports; default imports reserved for modules exporting a single primary value (e.g., `next/link`).
- Group styles/side-effect imports (`import './globals.css'`) after value imports.
- Avoid wildcard imports except for React (`import * as React from 'react'`) and icon libraries where necessary.
- Keep import statements free of trailing semicolons to match existing files.
- Use the `@/lib/utils` `cn` helper for composing class names instead of manual template strings.
- Use `type` modifiers when importing types (`import type { Metadata } from 'next'`) to help treeshaking.
- Rely on path aliases instead of long relative chains.
- Remove unused imports immediately; ESLint is configured to flag them.

## Code Style: Formatting & Syntax
- Strings: default to single quotes; `'use client'` directive stays double quoted to keep Next happy.
- No semicolons; rely on ASI like the rest of the codebase.
- Trailing commas appear only where existing files already use them; avoid adding new trailing commas in arrays/objects unless matching context.
- Limit line length to roughly 100 characters; wrap JSX props vertically when exceeding width.
- Use template literals for multi-line strings instead of string concatenation.
- Keep whitespace meaningful: blank line between logical sections, but avoid double-blank spacing.
- Use TypeScript `as const` where literal unions are intended (see `hooks/use-toast.ts`).
- Export named functions/components; default export reserved for Next route components (e.g., `app/page.tsx`).

## Code Style: Types & Props
- Embrace TypeScript `type` aliases for shapes; use interfaces only when extension is needed.
- For component props, define `type ComponentProps = { ... }` and reuse across files if shared.
- Use discriminated unions instead of `any`; never introduce `any` unless advanced generics block progress.
- Keep hooks typed explicitly (`const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)`).
- Import React types via `React` namespace or `import type { FC } from 'react'` when helpful.
- Reuse Next-provided types like `Metadata`, `Viewport` when editing route layout files.
- Use Zod for schema validation (already installed indirectly through forms) whenever user input is processed.
- When fetching data, encode return types explicitly to help future tests.

## Code Style: Components & Naming
- React components and hooks: PascalCase for components (`AuthModal`), camelCase for hooks (`useIsMobile`).
- File names mirror default export (e.g., `components/navbar.tsx` exports `Navbar`).
- Keep `'use client'` at the very top when required, followed by imports, blank line, component code.
- Prefer functional components with explicit return statements; avoid anonymous default exports outside route files.
- Break large JSX blocks into subcomponents when sections exceed ~150 lines.
- Use descriptive prop names over abbreviations; avoid `arr`, `obj`, etc.
- For icons and static arrays, keep data near usage but outside component body to avoid re-creation.
- Use descriptive section comments sparingly (see `app/page.tsx`) to delineate layout chunks.

## State, Side Effects & Data Fetching
- Context providers live in `components/`; reuse `AuthProvider` for auth state.
- Hooks should guard browser-only APIs (`typeof window !== 'undefined'`) if accessed in shared files.
- Async actions should handle errors via `try/catch` or by surfacing errors to toast notifications; never swallow Supabase errors silently.
- Debounce expensive operations manually or with small utilities; avoid pulling in heavy libs for simple tasks.
- When interacting with Supabase, handle network errors and display user feedback via `useToast`.
- Do not mutate React state directly; always use setters.

## Styling & Layout
- Rely on Tailwind utility classes plus tokens defined in `app/globals.css`.
- Favor `className={cn(...)} ` patterns to compose conditional styles.
- Keep gradients/background patterns consistent with existing sections (see `app/page.tsx`).
- Use CSS variables or Tailwind tokens for colors; never hardcode hex values unless adding a token.
- For layout containers, reuse `.container px-4` patterns already present.
- Animations should leverage `tw-animate-css` classes when possible.
- When adding new themes, update both light and dark custom properties in `app/globals.css`.

## Accessibility & UX
- Always set `aria` attributes for interactive components when not provided by shadcn defaults.
- Provide alt text for images (see `components/engineer-card.tsx`).
- Buttons/links: ensure icon-only buttons include `sr-only` labels where needed.
- Maintain keyboard navigation support; Radix primitives help, so use them instead of DIY popovers/menus.
- Respect reduced-motion preferences when adding animations.

## Error Handling & Logging
- Surface auth failures via `useToast` or inline form messages; avoid `alert()`.
- When throwing errors inside hooks (e.g., `useAuth`), provide actionable messages.
- Network calls should catch exceptions and either rethrow with context or handle gracefully.
- Do not log secrets; console logging should be stripped before merge unless debugging instructions say otherwise.
- For edge cases, include TODO comments only when accompanied by follow-up issue references.

## Assets & Content
- Store static assets in `public/`; import via `/path` rather than relative FS paths.
- For icons, prefer `lucide-react` already installed.
- When adding copy, maintain tone consistent with existing marketing content (community-focused, inclusive).
- Keep placeholder data centralized; do not scatter mock arrays across components.

## Supabase & Auth Notes
- All auth flows go through `AuthProvider`; open/close modal with provided context callbacks.
- When adding server actions that require Supabase, consider using Supabase Admin client on server side (not yet implemented).
- Token refresh handled by `supabase.auth.onAuthStateChange`; avoid duplicating listeners.

## Performance Considerations
- Use `React.useMemo` / `React.useCallback` sparingly; rely on React defaults unless profiling proves bottlenecks.
- Lazy-load heavy sections via dynamic imports when they are not above the fold.
- For carousels/embla, ensure SSR compatibility (wrap in `'use client'`).
- Remove unused CSS variables to prevent bloat; keep `app/globals.css` tidy.

## Documentation Expectations
- Update this file whenever commands or policies change; aim to keep it ~150 lines to stay scannable.
- Mention AGENTS.md in PR templates or descriptions as the enforced playbook.
- If you add new tooling (tests, formatters, CI), describe the workflow additions here immediately.

## Final Notes
- There are no Cursor or Copilot override files, so this doc governs automation behavior.
- When uncertain, inspect existing components (`components/ui/*`) and mirror their conventions.
- Suggest next steps (tests, monitoring, docs) in PRs when gaps are discovered.
- Keep changes focused; avoid bundling unrelated refactors unless the user requests a large cleanup.
