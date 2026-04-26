# Interview cheat sheet

Five questions you're most likely to be asked, with terse answers. Read these out loud until they sound natural.

---

**1. Walk me through the design of the API.**

Compound children: `<Accordion>` with `<Accordion.Item id header>` children. Three reasons over an `items` array prop: arbitrary JSX in headers and bodies, matches Radix / Chakra / MUI so it's the least surprising shape, and it composes — consumers can wrap `<Accordion.Item>` in their own component. State is controlled or uncontrolled: `defaultExpandedItems` for the simple case, `expandedItems` plus `onExpandedItemsChange` when a parent needs to drive it.

---

**2. How does accessibility work?**

Followed the WAI-ARIA accordion pattern. Each header is a real `<button>` wrapped in a heading element — level configurable 1 to 6. Buttons get `aria-expanded` and `aria-controls`. Panels get `role="region"` and `aria-labelledby` pointing back to their header. ARIA ids are built from `useId()` plus the user id so two accordions on a page can't collide. Disabled items use the native `disabled` attribute, so keyboard and screen-reader behaviour comes for free. Chevron is decorative, so `aria-hidden`. Skipped: roving tabindex with arrow-key nav between headers. The pattern recommends it but doesn't require it, and the recovered spec doesn't test it.

---

**3. Why styled-components and not Tailwind or CSS modules?**

A component library should look right out of the box without consumer setup. Tailwind pushes a config onto every consumer; CSS modules need a stylesheet imported somewhere. styled-components co-locates style with component and ships zero global CSS. The runtime cost is fine at this size, and the public API doesn't change if I swap to a zero-runtime CSS-in-JS like vanilla-extract later.

---

**4. Why does the panel body leave the DOM when collapsed?**

The recovered spec asserts `screen.queryByText('Content for panel one')` is `null` when closed. `hidden` and `display: none` both keep the node in the DOM, so the test would fail. Conditional render is the simplest thing that satisfies the assertion. Trade-off is animations — to add enter/exit transitions I'd switch to always-rendered with `framer-motion`'s `AnimatePresence` or a measured-height CSS wrapper.

---

**5. What would you do next, with more time?**

In priority order: keyboard nav between headers, animated expand/collapse, GitHub Actions running lint / typecheck / test / build per PR, visual regression with Chromatic on top of Storybook, theme provider so tokens live in a shared package, publishing pipeline with Changesets, more test coverage on controlled mode and disabled items, bundle-size budget with `size-limit`.

---

## Mini-glossary, in case they probe

- **`useId()`** — React 18 hook that returns a stable id, safe across SSR.
- **`role="region"`** — landmark role that lets screen readers list panels in a navigation menu.
- **`aria-controls`** — points an element at the id of what it controls; here, the header points at the panel.
- **`aria-labelledby`** — points the panel at the header that names it.
- **Controlled vs uncontrolled** — same pattern as `<input>`. Controlled means the parent owns the state; uncontrolled means the component does.
- **Library mode** in Vite — emits a bundle for `import` rather than serving an HTML page.
- **Peer deps** — declare React and react-dom as peer so consumers bring their own copy and we don't bundle React into the library.
