import { createContext, useContext } from 'react';
import type { AccordionHeadingLevel } from './types';

export interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (id: string) => void;
  headingLevel: AccordionHeadingLevel;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('<Accordion.Item> must be rendered inside <Accordion>.');
  }
  return ctx;
}
