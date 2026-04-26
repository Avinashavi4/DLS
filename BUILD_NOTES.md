# Build notes

Working notes on how this repo came together. Written for myself first, but useful as background for anyone reviewing the submission.

## The brief, in one paragraph

We've "lost" a component library and recovered a Vitest spec for an Accordion. Two tasks: (1) stand up a repo that could host more components later, document the tooling choices; (2) recreate the Accordion so the recovered tests pass, and make it flexible for downstream use cases. Suggested stack is TS / React / RTL / Vitest. Time budget: 2.5 hours.

## Order I worked in

1. Read the spec carefully. Pulled out the assertions before touching code. Noted three things that constrain the implementation:
   - Headers are `getAllByRole('button')`, so they must be real `<button>` elements (not `div` with click handlers).
   - `screen.queryByText('Content for panel one')` returns `null` when collapsed. That rules out hiding with CSS or the `hidden` attribute - the body has to leave the DOM.
   - `getAllByRole('region', { hidden: true })` and `aria-labelledby` checks - so each panel needs `role="region"` and ARIA wiring back to its header.
2. Picked the tooling (see below) before writing any component code.
3. Built the public API on paper: prop names, controlled vs uncontrolled, what `Accordion.Item` looks like at the call site.
4. Wrote `Accordion.tsx` and `AccordionItem.tsx`, got the spec passing.
5. Added Storybook stories so the variants render with controls and the a11y addon.
6. Added the demo page so `npm run dev` shows something useful without booting Storybook.
7. Wrote the README last, while the decisions were fresh.

## Why this stack

| Choice | Reason |
|---|---|
| **TypeScript** | The brief recommends it, and a component library leaks types into every consumer. Strict mode catches API mistakes early. |
| **React 18** | Same as the brief. `useId` (added in 18) is what I lean on for SSR-safe ARIA ids. |
| **Vite (lib mode)** | One config covers the dev page and the library bundle. The alternative is a separate Webpack/Rollup setup, which adds files for the same outcome. |
| **Vitest** | Same shape as the recovered spec. Faster start than Jest, and it shares the Vite config so I don't maintain two transformer chains. |
| **React Testing Library + user-event** | The spec was written for it. `user-event` v14 is async, which is why I wrote `renderWithUser` to set up a single instance per test. |
| **styled-components** | Each component ships its styles. Consumers don't need a global stylesheet or a Tailwind preset to make it look right. The runtime cost is fine for this size; the public API doesn't change if I swap to a zero-runtime CSS-in-JS later. |
| **Storybook 8 + addon-a11y** | Living docs, plus a manual a11y check during development without booting axe by hand. |
| **ESLint + Prettier** | Standard. The notable plugin is `eslint-plugin-jsx-a11y` since this is an accessibility-sensitive component. |

## Component shape, and why

### Compound children, not an `items` array

Two shapes were on the table:

```tsx
// A) array of objects
<Accordion items={[{ id, header, content }, ...]} />

// B) compound children (what I picked)
<Accordion>
  <Accordion.Item id="..." header={...}>...</Accordion.Item>
</Accordion>
```

(B) reads like the headline UIs: Radix, Chakra, MUI. It also dodges the "what if I want a button or icon in the header" awkwardness you get with shape (A), where `header` ends up being a string. Consumers can drop arbitrary JSX into both header and body.

### Controlled and uncontrolled

`defaultExpandedItems` for the simple case. `expandedItems` plus `onExpandedItemsChange` when a parent wants to drive state. Same pattern as `<input>`. The `isControlled` flag in `Accordion.tsx` is checked once per render and decides which source of truth to read.

### Conditional render of the panel body

The spec asserts collapsed content is `null` in the DOM. So `{expanded && <StyledPanel>...</StyledPanel>}` rather than rendering with `hidden`. Trade-off: enter/exit animations would need a wrapper (CSS `height` transition or `framer-motion`'s `AnimatePresence`). I called this out in the README under future work.

### `useId()` plus the user-supplied `id`

A counter or a hardcoded id would collide if two accordions were on the page. `useId()` gives a stable SSR-safe fragment. I still take a user `id` because it's the key for the controlled-state array and gives consumers something predictable to reference.

### ARIA

Followed the [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) directly:

- header is a real `<button>` wrapped in a heading element (level configurable 1-6 via `headingLevel`)
- `aria-expanded`, `aria-controls` on the button
- `role="region"`, `aria-labelledby` on the panel
- `disabled` items use the native attribute, so keyboard and screen-reader behaviour comes for free
- the chevron is purely decorative, so `aria-hidden`

### Internal context

`AccordionContext` is not exported. It's the connective tissue between `<Accordion>` and `<Accordion.Item>`. The `useAccordionContext` hook throws a useful error if someone tries to render `<AccordionItem>` standalone. This is a contract I want to fail fast on.

## Things I considered but didn't ship

In rough priority order if I had another sitting:

1. **Roving tabindex / arrow-key nav between headers.** Recommended by the WAI-ARIA pattern; not asserted by the spec. Would add `onKeyDown` to the header buttons and a focus manager in the parent.
2. **Animated expand/collapse.** Currently jumps. Either `framer-motion`'s `AnimatePresence` around the panel, or measure-and-animate height in CSS.
3. **CI workflow.** GitHub Actions running `lint`, `typecheck`, `test`, and `build` per PR. One yaml file.
4. **Visual regression** via Chromatic on top of Storybook.
5. **Theme provider.** Tokens in `Accordion.styles.ts` would move to a shared theme package and feed via `ThemeProvider`. Out of scope while the lib only has one component.
6. **Publishing pipeline.** Changesets for versioning, GitHub Releases, npm publish action.
7. **More test coverage.** Controlled-mode behaviour, disabled items, keyboard tests once nav is added.
8. **Bundle size budget** via `size-limit` so we'd notice if the library doubles unexpectedly.

## File-by-file walkthrough

```
src/
  components/Accordion/
    Accordion.tsx           Root component. Owns expanded state (or proxies a controlled one). Provides the toggle function and heading level via context.
    AccordionItem.tsx       One panel + header. Pulls state from context, manages its own ARIA ids.
    AccordionContext.ts     The internal context + a `useAccordionContext` hook that throws if used outside <Accordion>.
    Accordion.styles.ts     styled-components. Tokens are inline; would move to a theme package as the library grows.
    types.ts                AccordionProps, AccordionItemProps, AccordionHeadingLevel.
    index.ts                Module barrel. Re-exports the components and the public types.
    Accordion.test.tsx      The recovered spec, with two fixtures: renderAccordion (default) and renderAccordionWithAllOpen (used for a11y tests because regions only exist in the DOM when expanded).
    Accordion.stories.tsx   Default, SinglePanelOnly, WithDefaultExpanded, WithDisabledItem.
  test/
    setup.ts                jest-dom matchers + RTL cleanup after each test.
    renderWithUser.ts       Render helper that returns a userEvent.setup() instance alongside the result. The spec uses { user } destructuring, so this matches.
demo/
  index.html, main.tsx, App.tsx   Small dev-server page so `npm run dev` is useful on its own.
.storybook/                 Storybook config; addon-essentials + addon-a11y.
vite.config.ts              Two-mode: serves /demo in dev, emits library bundle in production.
tsconfig.json               Strict + bundler resolution. Includes src, demo, .storybook for editor tooling.
tsconfig.build.json         Library declarations only. Excludes tests, stories, the demo, and the test helpers.
```

## Anticipated review questions, and answers

**Q: Why styled-components and not CSS modules or Tailwind?**
A component library should ship looking right out of the box. Tailwind pushes config onto every consumer; CSS modules need a stylesheet to be imported somewhere. styled-components keeps style co-located with the component, with no consumer setup. Runtime cost is negligible for this size; if it ever bites we can swap to vanilla-extract or Panda without changing the public API.

**Q: Why compound children instead of an `items` prop?**
Three reasons. First, it lets consumers put arbitrary JSX in the header (icons, badges, links). Second, it matches what Radix, Chakra, and MUI all picked, so it's the least surprising shape. Third, it composes - someone can wrap `<Accordion.Item>` in their own component without prop spreading.

**Q: Why does the panel body actually leave the DOM when collapsed instead of being `hidden`?**
The recovered spec asserts `screen.queryByText('Content for panel one')` is `null` when closed. `hidden` keeps the node in the DOM, so the test would fail. Trade-off is animations - I'd revisit if/when we want them.

**Q: Why `useId()` if I already pass an `id`?**
The user `id` isn't guaranteed unique across the page. Two accordions could both have an item with `id="returns"`. Combining it with `useId()` gives a stable, SSR-safe id per item that won't collide.

**Q: How would I add keyboard navigation?**
Add `onKeyDown` on the header button. On `ArrowDown` / `ArrowUp`, find the next/previous enabled header in the parent and `focus()` it. `Home` / `End` jump to first/last. The cleanest implementation is to keep refs to each header in the parent context, since the parent already knows the order.

**Q: How would I make this a real package?**
The build is already set up. Steps left: add `repository`, `homepage`, `author`, and `keywords` to `package.json`; set up Changesets; wire a `release` GitHub Action that runs on `main`. Strip dev-only fields from the published artefact.

**Q: What stops a consumer from using `<AccordionItem>` outside an `<Accordion>`?**
The `useAccordionContext` hook throws if the context is null. The error message tells them why. Fail-fast is better than silent broken ARIA.

**Q: Where do tokens go when this becomes a real lib?**
Out of `Accordion.styles.ts` and into a shared theme package, fed through `ThemeProvider`. Each component reads from `theme.*` via `useTheme()` or template props. Inline now because there's only one component.

## Verification commands

```bash
npm install         # one-time
npm test            # 7/7 should pass
npm run lint        # ESLint, no warnings
npm run typecheck   # tsc --noEmit, clean
npm run build       # emits dist/ (ESM + .d.ts)
npm run dev         # demo page at http://localhost:5173/
npm run storybook   # full variants at http://localhost:6006/
npm run build-storybook  # static Storybook in storybook-static/
```
