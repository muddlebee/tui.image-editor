# AI Image Studio (MVP)

## Setup

1. Install dependencies at repo root:

```bash
npm install
```

2. Copy environment variables:

```bash
cp apps/ai-image-studio/.env.example apps/ai-image-studio/.env.local
```

3. Start the app:

```bash
npm run dev --workspace @workspace/ai-image-studio
```

## Validation Commands

```bash
npm run test:ai-image-studio
npm run typecheck:ai-image-studio
npm run build:ai-image-studio
```

## Notes

- Default generation model is `flux-schnell` (Replicate-first).
- `postinstall` copies `styled-jsx` into `apps/ai-image-studio/node_modules` so Next.js uses the same React runtime as the app workspace.
- Next may log lockfile patch warnings for SWC packages in this legacy monorepo, but current `build` exits successfully.
