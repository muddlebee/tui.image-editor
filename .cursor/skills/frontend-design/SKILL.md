---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Preferred Stack

Unless the project specifies otherwise, default to:

- **Next.js** App Router (`app/` directory). Use `"use client"` only on interactive components; keep server components as the default.
- **shadcn/ui** for all base UI primitives — `Button`, `Badge`, `Popover`, `Slider`, `ScrollArea`, `Separator`, `Tooltip`, `Dialog`, etc. Never recreate these from scratch with raw Tailwind. Install missing ones with `npx shadcn@latest add <name>`.
- **Tailwind CSS** for styling. Extend the theme in `tailwind.config.ts` with semantic design tokens rather than scattering arbitrary values in JSX.
- **next/font/google** for font loading — inject as CSS variables (`--font-display`, `--font-body`, `--font-mono`) and register in `tailwind.config.ts` as `fontFamily` extensions so they're available as Tailwind utilities.
- **Inline SVG** for icons — no icon library dependency unless the project already uses one.
- **CSS custom properties in `globals.css`** for all design tokens, following the shadcn HSL convention for system tokens (`--background`, `--foreground`, `--border`, `--ring`, etc.) and adding semantic app-specific tokens separately.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Pair a distinctive display font (headings) with a refined body font and a mono font for labels/badges/code. Load via `next/font/google` and expose as CSS variables. Good pairings: `Syne` + `DM Sans` + `DM Mono`, `Cabinet Grotesk` + `Instrument Sans`, `Archivo` + `DM Sans`, `Bebas Neue` + `Epilogue`. Avoid Inter, Roboto, Arial, Space Grotesk, system-ui as the primary face.
- **Color & Theme**: Commit to a cohesive aesthetic. Define all tokens as CSS custom properties in `globals.css @layer base`, mirroring shadcn's HSL variable convention. Add app-specific semantic tokens on top (e.g. `--panel`, `--surface`, `--accent-glow`). Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Define all keyframes in `globals.css` and expose as utility classes (`.animate-fade-up`, `.animate-scale-in`, `.stagger-children`). Use `animation-delay` for staggered reveals — one well-orchestrated page load creates more delight than scattered micro-interactions. The `tailwindcss-animate` plugin (included in shadcn init) handles Radix primitive animations automatically.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Layer: a solid background color + radial gradient glows tied to the accent palette + an SVG noise grain overlay at low opacity via `body::before`. Apply glassmorphism (`backdrop-blur` + semi-transparent panel backgrounds) for layered UI surfaces.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts, Space Grotesk), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

NEVER:
- Recreate shadcn primitives (`Button`, `Badge`, `Popover`, etc.) from raw Tailwind — install the component instead
- Use arbitrary Tailwind values in JSX (e.g. `w-[347px]`) when a design token or standard scale value works
- Import fonts from a CDN `<link>` tag — always use `next/font/google` for performance and zero layout shift
- Skip `backdrop-blur` on panel surfaces when glassmorphism is part of the aesthetic — it's load-bearing
- Use `<div style={{ backgroundImage: url(...) }}>` for images — always use `<img>` with proper `alt` text

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
