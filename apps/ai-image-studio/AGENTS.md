# AGENTS.md - AI Image Studio

This file defines local implementation guidance for agents working in `apps/ai-image-studio`.

## Scope

- Applies to: `apps/ai-image-studio/**`
- Goal: Midjourney-style AI image chat app built with Next.js App Router.

## Current Status

- Milestone 1 complete: foundation, store state machine, baseline UI views.
- Milestone 2 mostly complete: provider adapters + API routes + UI wired to real APIs.
- Remaining from Milestone 2: explicit cancellation flow.

## Stack

- Next.js 14 (App Router)
- React 18
- Zustand (state + persistence)
- Tailwind CSS
- Vitest

## Important Defaults

- Default generation path is **Replicate-first**:
  - Default model: `flux-schnell`
  - Only `flux-pro` uses fal.ai.
- API routes:
  - `POST /api/generate`
  - `POST /api/edit`
  - `POST /api/upscale`
  - `POST /api/remove-bg`

## Environment Variables

Use `apps/ai-image-studio/.env.example`.

Required for default flow:

- `REPLICATE_API_TOKEN`

Optional (needed only when selecting fal model):

- `FAL_API_KEY`

## Commands

From repo root:

```bash
npm run test:ai-image-studio
npm run typecheck:ai-image-studio
npm run build:ai-image-studio
npm run dev --workspace @workspace/ai-image-studio
```

## File Map

- UI entry: `app/page.tsx`
- Store: `lib/store.ts`
- AI provider layer: `lib/ai/*`
- API routes: `app/api/*/route.ts`
- Tests: `tests/*.test.ts`
- Milestones: `MILESTONES.md`

## Guardrails

- Keep provider calls server-side only.
- Preserve view state machine semantics: `empty | loading | grid | single | inpaint`.
- Keep validation strict in API routes; return typed JSON errors.
- Add/adjust tests when changing store transitions or API contracts.
- Do not reintroduce mock generation flows into production path.

## Known Monorepo Quirk

- This legacy monorepo may emit Next SWC lockfile patch warnings during build.
- Build is considered successful if `next build` exits with code 0 and routes are generated.