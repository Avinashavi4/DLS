import type { ReactNode } from 'react';

export type AccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface AccordionProps {
  children: ReactNode;
  /** When false, opening a panel collapses any other open panel. Default: true. */
  shouldAllowMultipleExpanded?: boolean;
  /** IDs expanded on first render. Ignored when `expandedItems` is set. */
  defaultExpandedItems?: string[];
  /** Controlled mode. Pair with `onExpandedItemsChange`. */
  expandedItems?: string[];
  onExpandedItemsChange?: (expandedItems: string[]) => void;
  /** Heading level wrapping each item header. Default: 3. */
  headingLevel?: AccordionHeadingLevel;
  className?: string;
}

export interface AccordionItemProps {
  /** Stable id. Used as the React key and as the basis for ARIA wiring. */
  id: string;
  header: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}
