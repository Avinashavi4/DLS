# Amex DLS — Accordion

> Part of the **American Express Design Language System (DLS)**. An accessible, fully-typed Accordion built for the consumer- and merchant-facing surfaces at Amex.

The Accordion is the seed component of the wider DLS React library. It ships with controlled / uncontrolled state, configurable heading levels, single- vs. multi-open behaviour, and the full WAI-ARIA accordion pattern wired by default.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API](#api)
5. [Styling and theming](#styling-and-theming)
6. [Accessibility](#accessibility)
7. [Project layout](#project-layout)
8. [Local development](#local-development)
9. [Quality gates](#quality-gates)
10. [Design notes](#design-notes)
11. [Roadmap](#roadmap)
12. [Stack](#stack)

---

## Quick start

```bash
npm install
npm run dev          # Amex-branded Accordion demo
npm run mybook       # MyBook component workspace (port 6007)
npm test             # unit tests
npm run build        # library bundle to ./dist
```

The demo renders three live Accordion configurations — multi-/single-open, controlled, and inline-style overrides — against the Amex token palette.

## Installation

```bash
npm install @amex-dls/accordion
# peer deps
npm install react react-dom styled-components
```

The library ships **ES modules** with full TypeScript declarations.

## Usage

### Basic

```tsx
import { Accordion } from '@amex-dls/accordion';

export function FaqSection() {
  return (
    <Accordion>
      <Accordion.Item id="rewards" header="How do Membership Rewards points work?">
        Earn points on eligible purchases and redeem them for travel, gift cards, or
        statement credits.
      </Accordion.Item>
      <Accordion.Item id="fees" header="Annual fee &amp; benefits">
        Your annual fee unlocks card benefits including travel credits and lounge access.
      </Accordion.Item>
    </Accordion>
  );
}
```

### Single-open mode

Open one panel collapses any other.

```tsx
<Accordion shouldAllowMultipleExpanded={false}>{/* …items */}</Accordion>
```

### Default expanded items (uncontrolled)

```tsx
<Accordion defaultExpandedItems={['rewards']}>{/* …items */}</Accordion>
```

### Controlled state

```tsx
const [open, setOpen] = useState<string[]>(['fees']);

<Accordion expandedItems={open} onExpandedItemsChange={setOpen}>
  {/* …items */}
</Accordion>
```

### Heading level

Pick any level 1–6 to match the host page's outline.

```tsx
<Accordion headingLevel={2}>{/* …items */}</Accordion>
```

### Inline overrides via `style`

`className` and `style` flow through to the root element of `Accordion` and to each `Accordion.Item`. Useful when a consumer needs a one-off tweak without forking the component or wrapping it in a styled wrapper.

```tsx
<Accordion style={{ maxWidth: 720 }}>
  <Accordion.Item
    id="alerts"
    header="Account alerts"
    style={{ borderInlineStart: '4px solid #006FCF' }}
  >
    Manage notifications for charges, payments, and travel.
  </Accordion.Item>
</Accordion>
```

> Inline styles are intentionally a last-resort escape hatch — prefer `className` and the design tokens — but the prop is exposed so app teams aren't blocked.

## API

### `<Accordion>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | One or more `<Accordion.Item>` children. |
| `shouldAllowMultipleExpanded` | `boolean` | `true` | When `false`, opening a panel collapses any other open panel. |
| `defaultExpandedItems` | `string[]` | `[]` | Item ids expanded on first render (uncontrolled mode). Ignored when `expandedItems` is set. |
| `expandedItems` | `string[]` | — | Controlled set of expanded ids. Pair with `onExpandedItemsChange`. |
| `onExpandedItemsChange` | `(ids: string[]) => void` | — | Fires whenever the expanded set changes. Always called, even in uncontrolled mode. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level wrapping each item header. |
| `className` | `string` | — | Class on the root element. |
| `style` | `CSSProperties` | — | Inline style on the root element. |

### `<Accordion.Item>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Stable id. Used as the React key and ARIA-wiring basis. |
| `header` | `ReactNode` | — | Header content (text, icons, badges). |
| `children` | `ReactNode` | — | Panel content. |
| `disabled` | `boolean` | `false` | Native `disabled` on the header button. |
| `className` | `string` | — | Class on the item wrapper. |
| `style` | `CSSProperties` | — | Inline style on the item wrapper. |

## Styling and theming

Styles live in `Accordion.styles.ts` as styled-components with inline tokens. Each component ships its own styles, so consuming apps don't need to wire global CSS or a Tailwind preset to render correctly.

The token block is the single source of truth for colours, spacing, and typography:

```ts
const tokens = {
  borderColor: '#d8d8d8',
  borderRadius: '6px',
  headerBg: '#ffffff',
  headerHoverBg: '#f6f6f6',
  headerActiveBg: '#eef4ff',
  textColor: '#1a1a1a',
  focusRing: '#2563eb',
  panelBg: '#fafafa',
  fontStack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};
```

If the wider DLS adopts a `ThemeProvider`, these tokens will be the first to migrate. The public API will not change.

## Accessibility

Implements the [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/):

- Each header is a real `<button>` wrapped in a configurable heading (`h1`–`h6`).
- `aria-expanded`, `aria-controls`, `role="region"`, and `aria-labelledby` are all wired.
- Disabled items use the native `disabled` attribute, not `aria-disabled`, so they're skipped in tab order automatically.
- The chevron is decorative (`aria-hidden`).
- Collapsed panel bodies are removed from the DOM rather than hidden with CSS, which keeps the accessibility tree clean for screen readers.

## Project layout

```
src/
  components/Accordion/
    Accordion.tsx           root component, owns expanded state
    AccordionItem.tsx       one panel + its header
    AccordionContext.ts     internal context, not exported
    Accordion.styles.ts     styled-components tokens + primitives
    Accordion.test.tsx      unit tests (Vitest + RTL)
    Accordion.stories.tsx   MyBook stories
    types.ts                public types
    index.ts                barrel
  test/
    setup.ts                jest-dom matchers + cleanup
    renderWithUser.ts       RTL render helper with user-event setup
demo/                       Amex-branded Accordion showcase (Vite dev entry)
.mybook/                    MyBook (Storybook) configuration
.husky/                     git hooks (pre-commit lint + tests)
```

## Local development

```bash
npm install            # install deps + activate husky hooks via "prepare"
npm run dev            # Amex-branded Accordion demo on Vite's default port
npm run mybook         # MyBook component workspace on :6007
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # Vitest in CI mode
npm run test:watch     # Vitest in watch mode
npm run test:coverage  # coverage report
npm run format         # Prettier write
npm run build          # library bundle + .d.ts
```

## Quality gates

A `pre-commit` hook (husky + lint-staged) runs on every commit and blocks anything that fails:

1. **ESLint** — staged `.ts` / `.tsx` only.
2. **Prettier** — staged files only, applied in-place.
3. **TypeScript** — `tsc --noEmit` on the whole project.
4. **Vitest** — full unit suite, single run.

Skipping the hook (`--no-verify`) should be reserved for genuine emergencies and called out in the PR description.

## Design notes

**Vite, library mode.** One config covers the demo page and the library build, so we don't run parallel Webpack/Rollup setups for what's effectively the same project.

**styled-components.** Each component ships with its styles, so consumers don't have to wire global CSS or a Tailwind preset to render correctly. The runtime cost is acceptable today; if it becomes a problem, the public API doesn't change when we swap to a zero-runtime alternative (vanilla-extract, Panda).

**Compound children, not a `panels` array.** `<Accordion.Item>` lets consumers drop arbitrary JSX into the header (icons, badges, status pills) without extra props. Same shape as Radix, Chakra, and MUI.

**Controlled and uncontrolled.** `defaultExpandedItems` for the simple case; `expandedItems` + `onExpandedItemsChange` when a parent needs to drive state.

**Conditional rendering of panel bodies.** Collapsed content is removed from the DOM rather than CSS-hidden. The rendered tree stays concise; enter/exit animations can be added later with a measured-height wrapper.

**`className` + `style` escape hatches.** Both are forwarded to the root and item elements. Inline styles aren't the recommended path, but they're available so app teams aren't blocked when the design tokens don't yet cover their case.

## Roadmap

In priority order:

1. Roving tabindex / arrow-key nav between headers
2. Animated expand / collapse
3. CI workflow (`lint` / `typecheck` / `test` / `build`)
4. Visual regression for component states
5. `ThemeProvider` — tokens currently inline in `Accordion.styles.ts`
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
| Tests | Vitest + React Testing Library + user-event |
| Docs | MyBook (Storybook) workspace |
| Lint / format | ESLint + Prettier |
| Git hooks | husky + lint-staged |

---

_American Express Design Language System — internal component library._
