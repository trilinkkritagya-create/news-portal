# Next.js Frontend & Responsive UI Rules (Agent Guide)

You are acting as a senior frontend engineer + UI/UX designer on a Next.js full-stack
app. These rules exist because agents keep breaking layout, responsiveness, and text
scaling. Follow them strictly for every UI task.

---

## 1. Core Responsive Philosophy

- **Mobile-first, always.** Write base styles for the smallest screen (~360px) first,
  then layer up with `sm:` `md:` `lg:` `xl:` `2xl:` (Tailwind) or `min-width` media
  queries. Never design desktop-first and shrink down.
- **Never use fixed pixel widths/heights on layout containers.** Use relative units:
  `%`, `rem`, `fr` (grid), `min()`, `max()`, `clamp()`, or `auto`.
- **Test at these breakpoints minimum** before calling a task done:
  - 360px (small mobile)
  - 390–430px (standard mobile)
  - 768px (tablet portrait)
  - 1024px (tablet landscape / small laptop)
  - 1280px–1440px (laptop/desktop)
  - 1920px (large desktop)
- If you cannot visually test, reason through each breakpoint explicitly before
  finishing — don't assume it "just works."

## 2. Standard Breakpoint Scale (use consistently across the whole app)

```
xs: 0px      // base, mobile
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```
If using Tailwind, this matches the default scale — do not override it mid-project
unless explicitly asked. If using custom CSS, define these as CSS variables in
`globals.css` and reuse them everywhere; never hardcode a random breakpoint like
`@media (min-width: 850px)` because it "looked right."

## 3. Layout Rules

- **Use CSS Grid for page/section layout, Flexbox for component-level alignment.**
  Don't use Flexbox to fake a grid (equal columns, wrapping cards) — use `grid` with
  `grid-template-columns: repeat(auto-fit, minmax(...))` instead.
- **Every page must live inside a constrained, centered container**, e.g.:
  ```css
  .container {
    width: 100%;
    max-width: 1280px;
    margin-inline: auto;
    padding-inline: clamp(1rem, 4vw, 3rem);
  }
  ```
- **Never let content touch the viewport edge on mobile.** Minimum horizontal padding
  of `1rem` (16px) at all times.
- **Avoid `position: absolute`/`fixed` for layout structure.** Only use it for
  overlays, tooltips, modals, sticky headers — never to position core page content.
  If an agent reaches for `absolute` to "fix" a layout bug, that's a signal the
  underlying flex/grid structure is wrong — fix the structure, don't patch with
  absolute positioning.
- **Flex-wrap by default** on any row-based layout that could overflow on smaller
  screens: `flex-wrap: wrap` + `gap` instead of `margin` hacks between items.
- **No horizontal scroll ever**, unless intentional (carousels). If content overflows,
  fix with `min-width: 0` on flex/grid children (a very common missed fix for text/
  images overflowing their containers) and `overflow-wrap: break-word`.

## 4. Typography & Text Sizing

- **Never use static `px` font sizes for body/heading text.** Use `rem` (scales with
  root font-size) and prefer fluid typography with `clamp()`:
  ```css
  h1 { font-size: clamp(1.75rem, 4vw + 1rem, 3rem); }
  p  { font-size: clamp(1rem, 1.5vw + 0.5rem, 1.125rem); }
  ```
- **Define a type scale once** (in `globals.css`, Tailwind config, or a `theme.ts`)
  and reuse it — no one-off font sizes scattered in components.
  Example scale: `text-xs (12px) / sm (14px) / base (16px) / lg (18px) / xl (20px) /
  2xl (24px) / 3xl (30px) / 4xl (36px) / 5xl (48px)`.
- **Line-height**: body text `1.5–1.6`, headings `1.1–1.3`. Never leave default
  browser line-height on large headings — it looks cramped or too loose.
- **Line length**: constrain paragraph text to `max-width: 65ch` for readability on
  large screens.
- **Truncate, don't overflow**: for single-line text that might overflow (names,
  titles in cards), use `text-overflow: ellipsis` + `overflow: hidden` +
  `white-space: nowrap`, or `line-clamp` for multi-line truncation — never let text
  silently break the layout.

## 5. Images & Media (Next.js specific)

- **Always use `next/image`**, never a raw `<img>`, unless the source is unknown at
  build time and truly needs a plain tag.
- Always set the `sizes` prop correctly when using `fill` or responsive width,
  matching actual rendered size at each breakpoint — a missing/wrong `sizes` is a
  common cause of layout shift and blurry images on mobile.
- Reserve aspect ratio for every image/video container (`aspect-ratio: 16/9;` or
  Next Image's width/height) to prevent Cumulative Layout Shift (CLS).

## 6. Common Bugs to Actively Prevent

When writing or reviewing layout code, explicitly check for these before finishing:

- [ ] Fixed `width`/`height` in px on a container that should flex — causes overflow
      or clipping on smaller screens.
- [ ] Missing `min-width: 0` on flex children containing text/images → causes
      horizontal overflow.
- [ ] Nested containers each adding their own `max-width` + `padding` → content gets
      squeezed too narrow on tablet.
- [ ] `100vw` used inside a container that already has padding/scrollbar → causes
      horizontal scrollbar. Use `100%` instead of `100vw` unless it's a true full-
      bleed section breaking out of a parent.
- [ ] Font sizes that don't shrink on mobile → headings wrapping awkwardly or
      overflowing small screens.
- [ ] Buttons/tap targets smaller than 44x44px on mobile — hard to tap.
- [ ] Modals/drawers that don't account for mobile viewport height (use `dvh` not
      `vh` for full-height elements, since `vh` misbehaves with mobile browser
      chrome).
- [ ] Grid/flex items without `gap`, relying on manual margins that break at
      different screen sizes.
- [ ] Z-index conflicts between sticky headers, modals, and dropdowns — maintain a
      single z-index scale (e.g. `dropdown: 10, sticky-header: 20, modal: 50,
      toast: 100`) instead of arbitrary numbers per component.

## 7. Next.js App Router Structure Conventions

- Shared layout (nav, footer) belongs in `layout.tsx`, not duplicated per page.
- Use route groups `(marketing)`, `(dashboard)` to apply different layouts without
  affecting the URL structure.
- Keep `page.tsx` files thin — page-level data fetching + composition of components,
  not raw JSX-heavy UI. Extract UI into `components/`.
- Client-only interactive UI (dropdowns, modals, anything with `useState`/
  `useEffect`) must have `"use client"` at the top — but push this boundary as low
  in the tree as possible; don't make an entire page a client component just because
  one button needs interactivity.

## 8. Verification Checklist (run before marking any UI task done)

1. Does it look correct at 360px, 768px, 1024px, and 1440px?
2. Does any text overflow, wrap awkwardly, or get clipped at any of those sizes?
3. Is there any unintended horizontal scroll?
4. Do buttons/links have adequate tap target size on mobile (≥44px)?
5. Are images sized correctly with no layout shift?
6. Is spacing (margin/padding/gap) proportionate on mobile — not identical to
   desktop spacing that now feels too large/cramped?
7. Does the layout use relative units throughout, with zero unexplained fixed pixel
   widths on structural containers?

---

**When in doubt: build the structure with Grid/Flex + relative units + `clamp()`
first, then adjust — don't reach for fixed pixels, `absolute` positioning, or manual
breakpoint overrides as the first fix.**
