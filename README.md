# DLS Accordion

Accessible accordion component, built as the seed of a wider design-system library.

## Getting started

```bash
npm install
npm run dev          # demo page
npm test             # unit tests
npm run storybook    # Storybook with all variants
npm run build        # library bundle to /dist
```

## Layout

```
src/
  components/Accordion/
    Accordion.tsx          root component, owns expanded state
    AccordionItem.tsx      one panel + its header
    AccordionContext.ts    internal context, not exported
    Accordion.styles.ts    styled-components
    Accordion.test.tsx     unit tests
    Accordion.stories.tsx  Storybook stories
    types.ts               public types
    index.ts               barrel
  test/
    setup.ts               jest-dom matchers + cleanup
    renderWithUser.ts      RTL render helper
demo/                      dev-server entry
.storybook/                Storybook config
```

## Usage

```tsx
import { Accordion } from '@dls/accordion';

<Accordion>
  <Accordion.Item id="shipping" header="Shipping & delivery">
    Standard delivery is 3–5 working days.
  </Accordion.Item>
  <Accordion.Item id="returns" header="Returns policy">
    30 days for a full refund.
  </Accordion.Item>
</Accordion>
```

Single-open mode:

```tsx
<Accordion shouldAllowMultipleExpanded={false}>...</Accordion>
```

Controlled state:

```tsx
const [open, setOpen] = useState<string[]>(['returns']);

<Accordion expandedItems={open} onExpandedItemsChange={setOpen}>...</Accordion>
```

## Notable choices

**Vite, library mode.** One config covers the demo page and the library build, so we don't end up with parallel Webpack/Rollup setups for what's effectively the same project.

**styled-components.** Each component ships its styles with itself, so consumers don't have to wire global CSS or a Tailwind preset to make it look right. The runtime cost is fine for now; if it becomes a problem the public API doesn't change when we swap in a zero-runtime alternative (vanilla-extract, Panda).

**Compound children, not a `panels` array.** `<Accordion.Item>` lets consumers drop arbitrary JSX into the header (icons, badges) without needing extra props. Same shape Radix, Chakra, and MUI ship.

**Controlled and uncontrolled.** `defaultExpandedItems` for the simple case; `expandedItems` + `onExpandedItemsChange` when a parent needs to drive state.

**Conditional rendering of panel bodies.** The spec asserts collapsed content is absent from the DOM, so we can't rely on CSS hiding. Trade-off: enter/exit animations would need a wrapper (CSS height transition or `framer-motion`'s `AnimatePresence`).

**Accessibility.** [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/):

- header is a real `<button>`, wrapped in a heading (level configurable 1–6)
- `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby` all wired
- disabled items use the native `disabled` attribute
- the chevron is decorative — `aria-hidden`

Skipped on purpose, in priority order:

1. Roving tabindex / arrow-key nav between headers (recommended by the pattern, but optional and not in the spec)
2. Animated expand/collapse
3. CI workflow (`lint` / `typecheck` / `test` / `build`)
4. Visual regression on top of Storybook
5. Theme provider — tokens are inline in `Accordion.styles.ts` for now
6. Publishing pipeline (changesets, npm publish action)
7. Controlled-mode and disabled-state tests
8. Bundle-size budget (`size-limit`)

## Stack

| Area | Tool |
|---|---|
| Language | TypeScript |
| UI | React 18 |
| Styling | styled-components |
| Build | Vite (lib mode) |
| Tests | Vitest + RTL + user-event |
| Docs | Storybook 8 |
| Lint / format | ESLint + Prettier |
