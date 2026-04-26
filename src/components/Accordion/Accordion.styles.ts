import styled, { css } from 'styled-components';

const tokens = {
  borderColor: '#d8d8d8',
  borderRadius: '6px',
  headerBg: '#ffffff',
  headerHoverBg: '#f6f6f6',
  headerActiveBg: '#eef4ff',
  textColor: '#1a1a1a',
  focusRing: '#2563eb',
  panelBg: '#fafafa',
  fontStack:
    "system-ui, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
};

export const StyledAccordion = styled.div`
  font-family: ${tokens.fontStack};
  color: ${tokens.textColor};
  border: 1px solid ${tokens.borderColor};
  border-radius: ${tokens.borderRadius};
  overflow: hidden;
  width: 100%;
`;

export const StyledItem = styled.div`
  & + & {
    border-top: 1px solid ${tokens.borderColor};
  }
`;

interface HeaderButtonProps {
  $expanded: boolean;
}

export const StyledHeaderButton = styled.button<HeaderButtonProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border: 0;
  background: ${tokens.headerBg};
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  color: inherit;

  &:hover:not(:disabled) {
    background: ${tokens.headerHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.focusRing};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  ${(p) =>
    p.$expanded &&
    css`
      background: ${tokens.headerActiveBg};
    `}
`;

export const StyledHeading = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: inherit;
`;

export const StyledChevron = styled.span<HeaderButtonProps>`
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(${(p) => (p.$expanded ? '-135deg' : '45deg')});
  transition: transform 180ms ease;
  margin-left: 0.75rem;
`;

export const StyledPanel = styled.div`
  padding: 1rem;
  background: ${tokens.panelBg};
  border-top: 1px solid ${tokens.borderColor};
`;
