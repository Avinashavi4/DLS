import { useId } from 'react';
import { useAccordionContext } from './AccordionContext';
import {
  StyledChevron,
  StyledHeaderButton,
  StyledHeading,
  StyledItem,
  StyledPanel,
} from './Accordion.styles';
import type { AccordionItemProps } from './types';

export function AccordionItem({
  id,
  header,
  children,
  disabled = false,
  className,
  style,
}: AccordionItemProps) {
  const { expandedItems, toggleItem, headingLevel } = useAccordionContext();
  const expanded = expandedItems.includes(id);

  // Combine the user id with a useId() fragment so two accordions on one page
  // can reuse panel ids without colliding in the DOM.
  const reactId = useId();
  const headerId = `dls-accordion-header-${reactId}`;
  const panelId = `dls-accordion-panel-${reactId}`;

  const Heading = `h${headingLevel}` as const;

  return (
    <StyledItem data-item-id={id} className={className} style={style}>
      <StyledHeading as={Heading}>
        <StyledHeaderButton
          type="button"
          id={headerId}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => toggleItem(id)}
          disabled={disabled}
          $expanded={expanded}
        >
          <span>{header}</span>
          <StyledChevron $expanded={expanded} aria-hidden="true" />
        </StyledHeaderButton>
      </StyledHeading>

      {expanded && (
        <StyledPanel id={panelId} role="region" aria-labelledby={headerId}>
          {children}
        </StyledPanel>
      )}
    </StyledItem>
  );
}
