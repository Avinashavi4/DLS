import { useCallback, useMemo, useState } from 'react';
import { AccordionContext } from './AccordionContext';
import { AccordionItem } from './AccordionItem';
import { StyledAccordion } from './Accordion.styles';
import type { AccordionProps } from './types';

export function Accordion({
  children,
  shouldAllowMultipleExpanded = true,
  defaultExpandedItems,
  expandedItems: controlledExpandedItems,
  onExpandedItemsChange,
  headingLevel = 3,
  className,
  style,
}: AccordionProps) {
  const isControlled = controlledExpandedItems !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<string[]>(
    defaultExpandedItems ?? []
  );
  const expandedItems = isControlled ? controlledExpandedItems : internalExpanded;

  const toggleItem = useCallback(
    (id: string) => {
      const isOpen = expandedItems.includes(id);
      let next: string[];
      if (isOpen) {
        next = expandedItems.filter((x) => x !== id);
      } else if (shouldAllowMultipleExpanded) {
        next = [...expandedItems, id];
      } else {
        next = [id];
      }

      if (!isControlled) setInternalExpanded(next);
      onExpandedItemsChange?.(next);
    },
    [expandedItems, isControlled, onExpandedItemsChange, shouldAllowMultipleExpanded]
  );

  const contextValue = useMemo(
    () => ({ expandedItems, toggleItem, headingLevel }),
    [expandedItems, toggleItem, headingLevel]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <StyledAccordion
        className={className}
        style={style}
        data-testid="dls-accordion"
      >
        {children}
      </StyledAccordion>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
