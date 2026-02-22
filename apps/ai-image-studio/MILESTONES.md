# AI Image Studio Milestones

## Milestone 1 - Foundation (current PR)

- [x] Scaffold `apps/ai-image-studio` as a Next.js + Tailwind workspace app.
- [x] Implement typed Zustand store with view state machine (`empty/loading/grid/single/inpaint`).
- [x] Implement baseline UI for the 5 key views and desktop layout shell.
- [x] Add API route placeholders (`/api/generate`, `/api/edit`, `/api/upscale`, `/api/remove-bg`).
- [x] Add unit tests for store transitions.

## Milestone 2 - Real AI Integrations

- [x] Build provider adapters for Replicate and fal.ai.
- [x] Implement actual `/api/generate`, `/api/edit`, `/api/upscale`, `/api/remove-bg`.
- [x] Move UI generation/edit actions from mock data to API calls.
- [x] Add structured error mapping.
- [ ] Add cancellation.

## Milestone 3 - Midjourney-style Interactions

- [ ] Implement U1-U4 / V1-V4 actions.
- [ ] Add chat intent routing for generate/edit/upscale requests.
- [ ] Build real inpaint mask editor (brush/eraser/undo/clear).

## Milestone 4 - Polish and Responsive

- [ ] Tablet/mobile responsive behavior from plan spec.
- [ ] Keyboard shortcuts.
- [ ] Download action, improved history UX, and loading/progress refinements.
