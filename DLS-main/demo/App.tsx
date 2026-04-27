import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { Accordion } from '../src/components/Accordion';
import type { AccordionHeadingLevel } from '../src/components/Accordion/types';

const tokens = {
  amexBlue: '#006FCF',
  amexBlueDeep: '#002663',
  amexBlueInk: '#00175A',
  amexAccent: '#2557D6',
  amexGold: '#C5A572',
  surface: '#ffffff',
  surfaceMuted: '#f6f8fc',
  pageBg: '#eef2f8',
  border: '#dde3ec',
  borderStrong: '#c5cdd9',
  text: '#0b1d39',
  textMuted: '#5b6472',
  textSubtle: '#8590a0',
  success: '#067647',
  warning: '#b54708',
  fontSerif: "'Source Serif 4', Georgia, 'Times New Roman', serif",
  fontSans:
    "'Helvetica Neue', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: ${tokens.pageBg}; color: ${tokens.text}; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
`;

const Shell = styled.div`
  font-family: ${tokens.fontSans};
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 5;
  background: ${tokens.surface};
  border-bottom: 1px solid ${tokens.border};
  backdrop-filter: saturate(140%) blur(8px);
`;

const TopBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: inherit;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.72rem;
`;

const Centurion = styled.span`
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${tokens.amexBlue};
  color: #fff;
  font-weight: 900;
  font-size: 0.8rem;
  font-family: ${tokens.fontSerif};
`;

const Crumbs = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: ${tokens.textMuted};

  span[aria-current='page'] {
    color: ${tokens.text};
    font-weight: 600;
  }

  span[aria-hidden='true'] {
    color: ${tokens.textSubtle};
  }
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Pill = styled.span<{ $tone?: 'info' | 'success' | 'warn' | 'neutral' }>`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  ${({ $tone = 'info' }) => {
    if ($tone === 'success')
      return css`
        background: #ecf8f0;
        color: ${tokens.success};
      `;
    if ($tone === 'warn')
      return css`
        background: #fff3e6;
        color: ${tokens.warning};
      `;
    if ($tone === 'neutral')
      return css`
        background: ${tokens.surfaceMuted};
        color: ${tokens.textMuted};
      `;
    return css`
      background: #eaf2fc;
      color: ${tokens.amexAccent};
    `;
  }}
`;

const GhostButton = styled.button`
  border: 1px solid ${tokens.border};
  background: ${tokens.surface};
  color: ${tokens.text};
  font: inherit;
  font-weight: 600;
  font-size: 0.82rem;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 120ms ease, background 120ms ease;

  &:hover {
    border-color: ${tokens.borderStrong};
    background: ${tokens.surfaceMuted};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.amexBlue};
    outline-offset: 2px;
  }
`;

const Hero = styled.section`
  background: ${tokens.surface};
  border-bottom: 1px solid ${tokens.border};
`;

const HeroInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.25rem 1.5rem 2.5rem;
  display: grid;
  gap: 0.6rem;
`;

const HeroEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: ${tokens.textMuted};
`;

const HeroTitle = styled.h1`
  margin: 0.25rem 0 0;
  font-family: ${tokens.fontSerif};
  font-size: clamp(1.85rem, 2.6vw + 0.5rem, 2.6rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.012em;
`;

const HeroLede = styled.p`
  margin: 0;
  max-width: 60ch;
  color: ${tokens.textMuted};
  font-size: 1.02rem;
  line-height: 1.55;
`;

const HeroMeta = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  color: ${tokens.textSubtle};
  font-size: 0.82rem;

  code {
    font-family: ${tokens.fontMono};
    background: ${tokens.surfaceMuted};
    border: 1px solid ${tokens.border};
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    color: ${tokens.text};
  }

  span.dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.5;
  }
`;

const Body = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 2rem;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const SideNav = styled.aside`
  position: sticky;
  top: 88px;
  align-self: start;
  display: grid;
  gap: 0.25rem;
  font-size: 0.9rem;

  @media (max-width: 920px) {
    position: static;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`;

const SideNavGroup = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${tokens.textSubtle};
  padding: 0.65rem 0.6rem 0.35rem;
`;

const SideNavItem = styled.a<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  color: ${({ $active, $disabled }) =>
    $disabled ? tokens.textSubtle : $active ? tokens.amexBlueInk : tokens.text};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  background: ${({ $active }) => ($active ? '#eaf2fc' : 'transparent')};
  text-decoration: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  border: 1px solid ${({ $active }) => ($active ? '#cfe1f5' : 'transparent')};

  small {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${tokens.textSubtle};
  }

  &:hover {
    background: ${({ $active }) => ($active ? '#eaf2fc' : tokens.surfaceMuted)};
  }
`;

const Main = styled.div`
  display: grid;
  gap: 2rem;
  min-width: 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid ${tokens.border};
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  color: ${({ $active }) => ($active ? tokens.text : tokens.textMuted)};
  padding: 0.7rem 0.95rem;
  cursor: pointer;
  font-size: 0.92rem;

  &::after {
    content: '';
    position: absolute;
    inset: auto 0.6rem -1px 0.6rem;
    height: 2px;
    background: ${({ $active }) => ($active ? tokens.amexBlue : 'transparent')};
    transition: background 160ms ease;
  }

  &:hover {
    color: ${tokens.text};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.amexBlue};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

const Card = styled.section`
  background: ${tokens.surface};
  border: 1px solid ${tokens.border};
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 8px 28px rgb(11 29 57 / 4%);
`;

const CardHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
`;

const CardHint = styled.p`
  margin: 0.35rem 0 0;
  color: ${tokens.textMuted};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const RichBody = styled.div`
  display: grid;
  gap: 0.6rem;
  font-size: 0.94rem;
  line-height: 1.55;
  color: ${tokens.text};

  p {
    margin: 0;
  }

  ul {
    margin: 0;
    padding-left: 1.1rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  a {
    color: ${tokens.amexBlue};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const InlineBadge = styled.span<{ $tone?: 'info' | 'success' | 'warn' }>`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  margin-left: 0.5rem;
  vertical-align: 1px;
  ${({ $tone = 'info' }) => {
    if ($tone === 'success')
      return css`
        background: #ecf8f0;
        color: ${tokens.success};
      `;
    if ($tone === 'warn')
      return css`
        background: #fff3e6;
        color: ${tokens.warning};
      `;
    return css`
      background: #eaf2fc;
      color: ${tokens.amexAccent};
    `;
  }}
`;

interface FaqEntry {
  id: string;
  header: ReactNode;
  body: ReactNode;
}

function buildFaqEntries(open: (key: DialogKey) => void): FaqEntry[] {
  const linkBtn = (label: string, key: DialogKey) => (
    <button
      type="button"
      onClick={() => open(key)}
      style={{
        background: 'none',
        border: 0,
        padding: 0,
        font: 'inherit',
        color: tokens.amexBlue,
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
      onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
    >
      {label}
    </button>
  );

  return [
    {
      id: 'rewards',
      header: 'How do Membership Rewards points work?',
      body: (
        <RichBody>
          <p>
            Earn points on eligible purchases and redeem them for travel, gift cards,
            or statement credits. Bonus categories vary by Card.
          </p>
          <ul>
            <li>5x on flights booked through Amex Travel</li>
            <li>3x on dining at U.S. restaurants</li>
            <li>1x on all other eligible purchases</li>
          </ul>
          <p>
            {linkBtn('Manage your points', 'faq-rewards')} &middot;{' '}
            {linkBtn('Transfer to partners', 'faq-partners')}
          </p>
        </RichBody>
      ),
    },
    {
      id: 'travel',
      header: (
        <span>
          Travel benefits and lounge access
          <InlineBadge $tone="success">New</InlineBadge>
        </span>
      ),
      body: (
        <RichBody>
          <p>
            Eligible Cardmembers may receive complimentary access to The Centurion
            Lounge network, plus statement credits with eligible travel purchases.
          </p>
          <ul>
            <li>$200 annual airline fee credit on a selected qualifying carrier</li>
            <li>Fine Hotels + Resorts benefits at participating properties</li>
            <li>Complimentary access to The Centurion Lounge network</li>
          </ul>
        </RichBody>
      ),
    },
    {
      id: 'protection',
      header: 'Purchase & return protection',
      body: (
        <RichBody>
          <p>
            Eligible purchases are covered against accidental damage or theft for up
            to 90 days. Extended return windows apply on items the merchant won't take
            back.
          </p>
          <p>See {linkBtn('your Benefits Guide', 'faq-benefits')} for the full terms.</p>
        </RichBody>
      ),
    },
    {
      id: 'fees',
      header: (
        <span>
          Annual fee &amp; statement credits
          <InlineBadge>Featured</InlineBadge>
        </span>
      ),
      body: (
        <RichBody>
          <p>
            Your annual fee is offset by recurring statement credits across travel,
            dining, and digital entertainment categories. Most Cardmembers see net
            value after the first six months of active use.
          </p>
        </RichBody>
      ),
    },
  ];
}

const Playground = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr);
  gap: 1.5rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const PlayPreview = styled.div`
  border: 1px dashed ${tokens.border};
  border-radius: 10px;
  padding: 1.25rem;
  background: ${tokens.surfaceMuted};
`;

const Knobs = styled.div`
  display: grid;
  gap: 1rem;
  align-content: start;
`;

const KnobLabel = styled.label`
  display: grid;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: ${tokens.text};
`;

const KnobHelp = styled.span`
  display: block;
  font-weight: 400;
  color: ${tokens.textMuted};
  font-size: 0.78rem;
  margin-top: -0.25rem;
`;

const Switch = styled.button<{ $on: boolean }>`
  width: 42px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid ${({ $on }) => ($on ? tokens.amexBlue : tokens.borderStrong)};
  background: ${({ $on }) => ($on ? tokens.amexBlue : '#fff')};
  position: relative;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? '20px' : '2px')};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px rgb(11 29 57 / 24%);
    transition: left 140ms ease;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.amexBlue};
    outline-offset: 2px;
  }
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Segmented = styled.div`
  display: inline-flex;
  border: 1px solid ${tokens.border};
  border-radius: 8px;
  overflow: hidden;
  background: ${tokens.surface};
`;

const SegmentBtn = styled.button<{ $active: boolean }>`
  border: 0;
  background: ${({ $active }) => ($active ? tokens.amexBlue : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : tokens.text)};
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.5rem 0.7rem;
  cursor: pointer;
  min-width: 36px;

  & + & {
    border-left: 1px solid ${tokens.border};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.amexBlue};
    outline-offset: -2px;
  }
`;

const CodeBlock = styled.pre`
  margin: 0;
  font-family: ${tokens.fontMono};
  font-size: 0.78rem;
  line-height: 1.55;
  background: #0b1d39;
  color: #e6edf7;
  padding: 1rem 1.1rem;
  border-radius: 10px;
  overflow-x: auto;
  white-space: pre;
`;

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.85rem;
`;

const Swatch = styled.div`
  border: 1px solid ${tokens.border};
  border-radius: 10px;
  overflow: hidden;
  background: ${tokens.surface};
`;

const SwatchChip = styled.div<{ $bg: string; $dark?: boolean }>`
  height: 64px;
  background: ${({ $bg }) => $bg};
  color: ${({ $dark }) => ($dark ? '#fff' : tokens.text)};
  display: flex;
  align-items: flex-end;
  padding: 0.55rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const SwatchMeta = styled.div`
  padding: 0.55rem 0.75rem 0.7rem;
  font-size: 0.78rem;

  strong {
    display: block;
    font-size: 0.85rem;
    color: ${tokens.text};
  }

  span {
    color: ${tokens.textMuted};
    font-family: ${tokens.fontMono};
  }
`;

const A11yList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
`;

const A11yItem = styled.li`
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  font-size: 0.92rem;
  line-height: 1.5;
`;

const Check = styled.span`
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  background: #ecf8f0;
  color: ${tokens.success};
  font-weight: 800;
  font-size: 0.8rem;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(11, 29, 57, 0.42);
  backdrop-filter: blur(2px);
  animation: ${fadeIn} 140ms ease;
  z-index: 30;
`;

const DialogShell = styled.div<{ $wide?: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ $wide }) =>
    $wide ? 'min(820px, calc(100vw - 2rem))' : 'min(560px, calc(100vw - 2rem))'};
  max-height: calc(100vh - 4rem);
  overflow: auto;
  background: ${tokens.surface};
  border: 1px solid ${tokens.border};
  border-radius: 14px;
  box-shadow: 0 32px 64px rgb(11 29 57 / 28%);
  z-index: 31;
  animation: ${popIn} 160ms ease;
`;

const PreviewFrame = styled.div`
  background: ${tokens.surfaceMuted};
  border: 1px solid ${tokens.border};
  border-radius: 10px;
  padding: 1rem 1.1rem;
`;

const StoryCard = styled.section`
  border: 1px solid ${tokens.border};
  border-radius: 10px;
  background: ${tokens.surface};
  padding: 1rem 1.1rem;

  & + & {
    margin-top: 0.85rem;
  }
`;

const StoryHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.7rem;
  gap: 0.5rem;
`;

const StoryTitle = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
`;

const StoryHint = styled.p`
  margin: 0;
  color: ${tokens.textMuted};
  font-size: 0.78rem;
`;

const PlannedCard = styled.div`
  border: 1px dashed ${tokens.borderStrong};
  border-radius: 10px;
  background: ${tokens.surfaceMuted};
  padding: 1.1rem 1.2rem;
  display: grid;
  gap: 0.65rem;
`;

const PlannedSkeletonRow = styled.div`
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    ${tokens.border} 0%,
    ${tokens.borderStrong} 50%,
    ${tokens.border} 100%
  );
  background-size: 200% 100%;
  animation: skeleton 1400ms linear infinite;

  @keyframes skeleton {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.4rem 0.6rem;
`;

const DialogTitle = styled.h3`
  margin: 0;
  font-family: ${tokens.fontSerif};
  font-size: 1.25rem;
  font-weight: 600;
`;

const DialogClose = styled.button`
  border: 1px solid ${tokens.border};
  background: ${tokens.surfaceMuted};
  color: ${tokens.text};
  font: inherit;
  font-size: 0.95rem;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-grid;
  place-items: center;

  &:hover {
    background: ${tokens.border};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.amexBlue};
    outline-offset: 2px;
  }
`;

const DialogBody = styled.div`
  padding: 0.4rem 1.4rem 1.1rem;
  font-size: 0.94rem;
  line-height: 1.55;
  color: ${tokens.text};

  p { margin: 0.5rem 0; }
  ul { margin: 0.5rem 0; padding-left: 1.2rem; }
  li { margin-bottom: 0.25rem; }
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.4rem 1.4rem 1.2rem;
`;

const InlineCode = styled.code`
  font-family: ${tokens.fontMono};
  background: ${tokens.surfaceMuted};
  border: 1px solid ${tokens.border};
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85em;
`;

const KeyValueGrid = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.35rem 1rem;
  margin: 0.5rem 0 0;
  font-size: 0.88rem;

  dt { color: ${tokens.textMuted}; font-weight: 600; }
  dd { margin: 0; color: ${tokens.text}; }
  code { font-family: ${tokens.fontMono}; }
`;

/* -------------------------------------------------------------------------- */
/* Toast (action feedback)                                                    */
/* -------------------------------------------------------------------------- */

const slideIn = keyframes`
  from { opacity: 0; transform: translate(-50%, 12px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${tokens.amexBlueInk};
  color: #fff;
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 12px 32px rgb(0 23 90 / 30%);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${slideIn} 180ms ease;
  z-index: 20;
`;

const ToastDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf6f;
`;

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

const Footer = styled.footer`
  background: ${tokens.surface};
  border-top: 1px solid ${tokens.border};
  padding: 1.5rem;
  text-align: center;
  color: ${tokens.textMuted};
  font-size: 0.78rem;
`;

/* -------------------------------------------------------------------------- */
/* App                                                                        */
/* -------------------------------------------------------------------------- */

type TabKey = 'preview' | 'playground' | 'tokens' | 'a11y';

type DialogKey =
  | 'source'
  | 'mybook'
  | 'planned-modal'
  | 'planned-toast'
  | 'planned-tabs'
  | 'faq-rewards'
  | 'faq-partners'
  | 'faq-benefits';

interface PlannedSpec {
  name: string;
  version: string;
  summary: string;
  api: string[];
}

const plannedSpecs: Record<'modal' | 'toast' | 'tabs', PlannedSpec> = {
  modal: {
    name: 'Modal',
    version: 'v0.2',
    summary:
      'Accessible dialog with focus trap, escape to close, and scroll lock. Same compound-children pattern as Accordion.',
    api: [
      '<Modal open onClose={…}>',
      '  <Modal.Header>Confirm transaction</Modal.Header>',
      '  <Modal.Body>…</Modal.Body>',
      '  <Modal.Footer>…</Modal.Footer>',
      '</Modal>',
    ],
  },
  toast: {
    name: 'Toast',
    version: 'v0.2',
    summary:
      'Stacked notifications with success / warn / error tones, auto-dismiss, and screen-reader announcements.',
    api: [
      'const { push } = useToast();',
      "push({ tone: 'success', message: 'Card unlocked.' });",
    ],
  },
  tabs: {
    name: 'Tabs',
    version: 'v0.3',
    summary:
      'Roving-tabindex tab list with horizontal arrow navigation, optional manual or automatic activation.',
    api: [
      '<Tabs defaultValue="overview">',
      '  <Tabs.List>',
      '    <Tabs.Tab value="overview">Overview</Tabs.Tab>',
      '    <Tabs.Tab value="charges">Charges</Tabs.Tab>',
      '  </Tabs.List>',
      '  <Tabs.Panel value="overview">…</Tabs.Panel>',
      '</Tabs>',
    ],
  },
};

const faqMore: Record<'rewards' | 'partners' | 'benefits', { title: string; body: ReactNode }> = {
  rewards: {
    title: 'Manage your Membership Rewards',
    body: (
      <>
        <p>
          Sign in to <InlineCode>americanexpress.com/rewards</InlineCode> to view your
          balance, set up auto-redemption, or transfer points to airline and hotel
          partners.
        </p>
        <KeyValueGrid>
          <dt>Balance refresh</dt>
          <dd>Within 24 hours of an eligible posted purchase.</dd>
          <dt>Min. transfer</dt>
          <dd>1,000 points in 1,000-point increments.</dd>
          <dt>Expiry</dt>
          <dd>Points do not expire while your account is active.</dd>
        </KeyValueGrid>
      </>
    ),
  },
  partners: {
    title: 'Transfer to airline & hotel partners',
    body: (
      <>
        <p>Membership Rewards points transfer to participating travel partners:</p>
        <ul>
          <li>Delta SkyMiles &middot; 1:1</li>
          <li>British Airways Executive Club &middot; 1:1</li>
          <li>Marriott Bonvoy &middot; 1:1</li>
          <li>Hilton Honors &middot; 1:2</li>
        </ul>
        <p>Transfers typically post instantly and are non-reversible.</p>
      </>
    ),
  },
  benefits: {
    title: 'Benefits Guide',
    body: (
      <>
        <p>
          Your full Benefits Guide is available in the Amex app under{' '}
          <InlineCode>Account &rarr; Card Benefits</InlineCode>, or as a PDF download
          from the Cardmember Help Center.
        </p>
        <p>
          Coverage limits, claim windows, and exclusions vary by Card product and
          region.
        </p>
      </>
    ),
  },
};

export function App() {
  const [tab, setTab] = useState<TabKey>('preview');
  const [toast, setToast] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogKey | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // playground state
  const [multi, setMulti] = useState(true);
  const [level, setLevel] = useState<AccordionHeadingLevel>(3);
  const [openIds, setOpenIds] = useState<string[]>(['rewards']);

  function goTo(target: TabKey, message?: string) {
    setTab(target);
    if (message) setToast(message);
    requestAnimationFrame(() => {
      mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function copyText(text: string, message: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
    setToast(message);
  }

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!dialog) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDialog(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dialog]);

  const faqEntries = useMemo(() => buildFaqEntries(setDialog), []);

  const generatedCode = useMemo(() => {
    const expanded = openIds.length
      ? `\n  expandedItems={${JSON.stringify(openIds)}}\n  onExpandedItemsChange={setOpen}`
      : '';
    return [
      `<Accordion`,
      `  shouldAllowMultipleExpanded={${multi}}`,
      `  headingLevel={${level}}${expanded}`,
      `>`,
      `  <Accordion.Item id="rewards" header="Membership Rewards">…</Accordion.Item>`,
      `  <Accordion.Item id="travel" header="Travel benefits">…</Accordion.Item>`,
      `  <Accordion.Item id="fees" header="Annual fee">…</Accordion.Item>`,
      `</Accordion>`,
    ].join('\n');
  }, [multi, level, openIds]);

  return (
    <>
      <GlobalStyles />
      <Shell>
        <TopBar>
          <TopBarInner>
            <Brand href="#">
              <Centurion>A</Centurion>
              American Express &middot; DLS
            </Brand>
            <Crumbs aria-label="Breadcrumb">
              <span aria-hidden="true">/</span>
              <span>Components</span>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Accordion</span>
            </Crumbs>
            <TopActions>
              <Pill $tone="success">Stable</Pill>
              <GhostButton type="button" onClick={() => setDialog('source')}>
                View source
              </GhostButton>
              <GhostButton type="button" onClick={() => setDialog('mybook')}>
                Open MyBook
              </GhostButton>
            </TopActions>
          </TopBarInner>
        </TopBar>

        <Hero>
          <HeroInner>
            <HeroEyebrow>
              <Pill>Component</Pill>
              <span>Surface &middot; Cardmember help center</span>
            </HeroEyebrow>
            <HeroTitle>Accordion</HeroTitle>
            <HeroLede>
              The seed component of the Amex Design Language System. Accessible by
              default, controlled or uncontrolled, themable through tokens, and shipped
              with the full WAI-ARIA accordion pattern wired in.
            </HeroLede>
            <HeroMeta>
              <code>@amex-dls/accordion</code>
              <span className="dot" />
              <span>v0.1.0</span>
              <span className="dot" />
              <span>React 18 &middot; styled-components</span>
              <span className="dot" />
              <span>Last updated today</span>
            </HeroMeta>
          </HeroInner>
        </Hero>

        <Body>
          <SideNav aria-label="DLS components">
            <SideNavGroup>Foundations</SideNavGroup>
            <SideNavItem
              href="#tokens"
              onClick={(e) => {
                e.preventDefault();
                goTo('tokens', 'Showing color tokens');
              }}
            >
              Color tokens
            </SideNavItem>
            <SideNavItem
              href="#typography"
              onClick={(e) => {
                e.preventDefault();
                goTo('a11y', 'Typography lives in the A11y guide');
              }}
            >
              Typography
            </SideNavItem>

            <SideNavGroup>Components</SideNavGroup>
            <SideNavItem
              href="#accordion"
              $active
              onClick={(e) => {
                e.preventDefault();
                goTo('preview', 'Accordion preview');
              }}
            >
              Accordion <small>v0.1</small>
            </SideNavItem>
            <SideNavItem
              href="#modal"
              onClick={(e) => {
                e.preventDefault();
                setDialog('planned-modal');
              }}
            >
              Modal <small>Planned</small>
            </SideNavItem>
            <SideNavItem
              href="#toast"
              onClick={(e) => {
                e.preventDefault();
                setDialog('planned-toast');
              }}
            >
              Toast <small>Planned</small>
            </SideNavItem>
            <SideNavItem
              href="#tabs"
              onClick={(e) => {
                e.preventDefault();
                setDialog('planned-tabs');
              }}
            >
              Tabs <small>Planned</small>
            </SideNavItem>
          </SideNav>

          <Main ref={mainRef}>
            <Tabs role="tablist">
              <Tab
                role="tab"
                aria-selected={tab === 'preview'}
                $active={tab === 'preview'}
                onClick={() => setTab('preview')}
              >
                Preview
              </Tab>
              <Tab
                role="tab"
                aria-selected={tab === 'playground'}
                $active={tab === 'playground'}
                onClick={() => setTab('playground')}
              >
                Playground
              </Tab>
              <Tab
                role="tab"
                aria-selected={tab === 'tokens'}
                $active={tab === 'tokens'}
                onClick={() => setTab('tokens')}
              >
                Tokens
              </Tab>
              <Tab
                role="tab"
                aria-selected={tab === 'a11y'}
                $active={tab === 'a11y'}
                onClick={() => setTab('a11y')}
              >
                Accessibility
              </Tab>
            </Tabs>

            {tab === 'preview' && (
              <Card aria-labelledby="preview-title">
                <CardHead>
                  <div>
                    <CardTitle id="preview-title">
                      Cardmember help center
                      <Pill $tone="neutral">Realistic surface</Pill>
                    </CardTitle>
                    <CardHint>
                      The Accordion in production context — rich children, status
                      badges, links, and inline-style accents per the design tokens.
                    </CardHint>
                  </div>
                </CardHead>

                <Accordion
                  defaultExpandedItems={['rewards']}
                  headingLevel={3}
                  style={{ borderRadius: 12 }}
                >
                  {faqEntries.map((entry) => (
                    <Accordion.Item
                      key={entry.id}
                      id={entry.id}
                      header={entry.header}
                      style={{ borderInlineStart: `4px solid ${tokens.amexBlue}` }}
                    >
                      {entry.body}
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card>
            )}

            {tab === 'playground' && (
              <Card aria-labelledby="playground-title">
                <CardHead>
                  <div>
                    <CardTitle id="playground-title">
                      Live playground
                      <Pill>Interactive</Pill>
                    </CardTitle>
                    <CardHint>
                      Drive the component with the prop knobs on the right. The code
                      sample updates in step.
                    </CardHint>
                  </div>
                </CardHead>

                <Playground>
                  <PlayPreview>
                    <Accordion
                      shouldAllowMultipleExpanded={multi}
                      headingLevel={level}
                      expandedItems={openIds}
                      onExpandedItemsChange={setOpenIds}
                    >
                      <Accordion.Item id="rewards" header="Membership Rewards">
                        Earn points on eligible purchases and redeem them for travel,
                        gift cards, or statement credits.
                      </Accordion.Item>
                      <Accordion.Item id="travel" header="Travel benefits">
                        Lounge access and statement credits with eligible travel
                        purchases.
                      </Accordion.Item>
                      <Accordion.Item id="fees" header="Annual fee">
                        Recurring statement credits across travel, dining, and digital
                        entertainment offset the annual fee.
                      </Accordion.Item>
                    </Accordion>

                    <CodeBlock aria-label="Generated JSX">{generatedCode}</CodeBlock>
                  </PlayPreview>

                  <Knobs>
                    <KnobLabel>
                      <SwitchRow>
                        <span>
                          shouldAllowMultipleExpanded
                          <KnobHelp>Multiple panels open at once.</KnobHelp>
                        </span>
                        <Switch
                          type="button"
                          role="switch"
                          aria-checked={multi}
                          $on={multi}
                          onClick={() => setMulti((v) => !v)}
                        />
                      </SwitchRow>
                    </KnobLabel>

                    <KnobLabel>
                      headingLevel
                      <KnobHelp>Heading wrapping each item header.</KnobHelp>
                      <Segmented role="group" aria-label="heading level">
                        {([1, 2, 3, 4, 5, 6] as AccordionHeadingLevel[]).map((n) => (
                          <SegmentBtn
                            key={n}
                            type="button"
                            $active={level === n}
                            onClick={() => setLevel(n)}
                            aria-pressed={level === n}
                          >
                            h{n}
                          </SegmentBtn>
                        ))}
                      </Segmented>
                    </KnobLabel>

                    <KnobLabel>
                      Controlled state
                      <KnobHelp>
                        <code style={{ fontFamily: tokens.fontMono }}>
                          {openIds.length ? `[${openIds.join(', ')}]` : '[]'}
                        </code>
                      </KnobHelp>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <GhostButton
                          type="button"
                          onClick={() => setOpenIds(['rewards', 'travel', 'fees'])}
                        >
                          Expand all
                        </GhostButton>
                        <GhostButton type="button" onClick={() => setOpenIds([])}>
                          Collapse all
                        </GhostButton>
                      </div>
                    </KnobLabel>

                    <KnobLabel>
                      Quick links
                      <KnobHelp>Jump to other tabs without scrolling.</KnobHelp>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <GhostButton
                          type="button"
                          onClick={() => goTo('tokens', 'Showing color tokens')}
                        >
                          Tokens →
                        </GhostButton>
                        <GhostButton
                          type="button"
                          onClick={() => goTo('a11y', 'Showing accessibility audit')}
                        >
                          A11y audit →
                        </GhostButton>
                        <GhostButton type="button" onClick={() => setDialog('mybook')}>
                          MyBook ↗
                        </GhostButton>
                      </div>
                    </KnobLabel>
                  </Knobs>
                </Playground>
              </Card>
            )}

            {tab === 'tokens' && (
              <Card aria-labelledby="tokens-title">
                <CardHead>
                  <div>
                    <CardTitle id="tokens-title">
                      Color tokens
                      <Pill $tone="neutral">Foundations</Pill>
                    </CardTitle>
                    <CardHint>
                      The token block is the single source of truth for the Accordion's
                      surface palette. A future <code>ThemeProvider</code> will swap
                      these without API changes.
                    </CardHint>
                  </div>
                  <GhostButton
                    type="button"
                    onClick={() =>
                      copyText(
                        'npm install @amex-dls/accordion',
                        'Install command copied'
                      )
                    }
                  >
                    Copy install command
                  </GhostButton>
                </CardHead>

                <SwatchGrid>
                  <Swatch>
                    <SwatchChip $bg={tokens.amexBlue} $dark>
                      Primary
                    </SwatchChip>
                    <SwatchMeta>
                      <strong>amexBlue</strong>
                      <span>{tokens.amexBlue}</span>
                    </SwatchMeta>
                  </Swatch>
                  <Swatch>
                    <SwatchChip $bg={tokens.amexBlueDeep} $dark>
                      Deep
                    </SwatchChip>
                    <SwatchMeta>
                      <strong>amexBlueDeep</strong>
                      <span>{tokens.amexBlueDeep}</span>
                    </SwatchMeta>
                  </Swatch>
                  <Swatch>
                    <SwatchChip $bg={tokens.amexAccent} $dark>
                      Accent
                    </SwatchChip>
                    <SwatchMeta>
                      <strong>amexAccent</strong>
                      <span>{tokens.amexAccent}</span>
                    </SwatchMeta>
                  </Swatch>
                  <Swatch>
                    <SwatchChip $bg={tokens.amexGold}>Gold</SwatchChip>
                    <SwatchMeta>
                      <strong>amexGold</strong>
                      <span>{tokens.amexGold}</span>
                    </SwatchMeta>
                  </Swatch>
                  <Swatch>
                    <SwatchChip $bg={tokens.surfaceMuted}>Surface muted</SwatchChip>
                    <SwatchMeta>
                      <strong>surfaceMuted</strong>
                      <span>{tokens.surfaceMuted}</span>
                    </SwatchMeta>
                  </Swatch>
                  <Swatch>
                    <SwatchChip $bg={tokens.border}>Border</SwatchChip>
                    <SwatchMeta>
                      <strong>border</strong>
                      <span>{tokens.border}</span>
                    </SwatchMeta>
                  </Swatch>
                </SwatchGrid>
              </Card>
            )}

            {tab === 'a11y' && (
              <Card aria-labelledby="a11y-title">
                <CardHead>
                  <div>
                    <CardTitle id="a11y-title">
                      Accessibility audit
                      <Pill $tone="success">WAI-ARIA pattern</Pill>
                    </CardTitle>
                    <CardHint>
                      Implements the{' '}
                      <a
                        href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        WAI-ARIA accordion pattern
                      </a>
                      . Items with no accompanying mitigation are listed in the README
                      roadmap.
                    </CardHint>
                  </div>
                </CardHead>

                <A11yList>
                  <A11yItem>
                    <Check aria-hidden="true">✓</Check>
                    Each header is a real <code>&lt;button&gt;</code> wrapped in a
                    configurable heading (<code>h1</code>–<code>h6</code>).
                  </A11yItem>
                  <A11yItem>
                    <Check aria-hidden="true">✓</Check>
                    <code>aria-expanded</code>, <code>aria-controls</code>,{' '}
                    <code>role="region"</code>, and <code>aria-labelledby</code> are
                    wired automatically.
                  </A11yItem>
                  <A11yItem>
                    <Check aria-hidden="true">✓</Check>
                    Disabled items use the native <code>disabled</code> attribute, so
                    they're skipped in tab order without extra ARIA.
                  </A11yItem>
                  <A11yItem>
                    <Check aria-hidden="true">✓</Check>
                    Chevron is <code>aria-hidden</code>; collapsed panel bodies are
                    removed from the DOM rather than CSS-hidden.
                  </A11yItem>
                  <A11yItem>
                    <Check aria-hidden="true">✓</Check>
                    Respects <code>prefers-reduced-motion</code> on the host page; the
                    component itself uses minimal motion (chevron rotation only).
                  </A11yItem>
                </A11yList>
              </Card>
            )}
          </Main>
        </Body>

        <Footer>
          &copy; {new Date().getFullYear()} American Express &middot; Design Language
          System &middot; Internal preview build
        </Footer>
      </Shell>

      {toast && (
        <Toast role="status" aria-live="polite">
          <ToastDot aria-hidden="true" />
          {toast}
        </Toast>
      )}

      {dialog && (
        <>
          <Backdrop onClick={() => setDialog(null)} />
          <DialogShell
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            $wide={dialog === 'source' || dialog === 'mybook'}
          >
            <DialogHeader>
              <DialogTitle id="dialog-title">
                {dialog === 'source' && 'Accordion · live preview'}
                {dialog === 'mybook' && 'MyBook · Accordion stories'}
                {dialog === 'planned-modal' && 'Modal · coming in v0.2'}
                {dialog === 'planned-toast' && 'Toast · coming in v0.2'}
                {dialog === 'planned-tabs' && 'Tabs · coming in v0.3'}
                {dialog === 'faq-rewards' && faqMore.rewards.title}
                {dialog === 'faq-partners' && faqMore.partners.title}
                {dialog === 'faq-benefits' && faqMore.benefits.title}
              </DialogTitle>
              <DialogClose
                type="button"
                aria-label="Close"
                onClick={() => setDialog(null)}
              >
                ✕
              </DialogClose>
            </DialogHeader>

            <DialogBody>
              {dialog === 'source' && (
                <>
                  <p>The component as it renders in production, with rich content.</p>
                  <PreviewFrame>
                    <Accordion defaultExpandedItems={['rewards']} headingLevel={4}>
                      <Accordion.Item
                        id="rewards"
                        header="Membership Rewards"
                        style={{ borderInlineStart: `4px solid ${tokens.amexBlue}` }}
                      >
                        Earn points on eligible purchases and redeem them for travel,
                        gift cards, or statement credits.
                      </Accordion.Item>
                      <Accordion.Item
                        id="travel"
                        header="Travel benefits"
                        style={{ borderInlineStart: `4px solid ${tokens.amexAccent}` }}
                      >
                        Lounge access and statement credits with eligible travel
                        purchases.
                      </Accordion.Item>
                      <Accordion.Item
                        id="fees"
                        header="Annual fee"
                        style={{ borderInlineStart: `4px solid ${tokens.amexGold}` }}
                      >
                        Recurring statement credits across travel, dining, and digital
                        entertainment offset the annual fee.
                      </Accordion.Item>
                    </Accordion>
                  </PreviewFrame>
                </>
              )}

              {dialog === 'mybook' && (
                <>
                  <p style={{ color: tokens.textMuted, fontSize: '0.88rem' }}>
                    Every published story for the Accordion, rendered live.
                  </p>

                  <StoryCard>
                    <StoryHead>
                      <StoryTitle>Default</StoryTitle>
                      <StoryHint>Multi-open · h3 headers</StoryHint>
                    </StoryHead>
                    <Accordion>
                      <Accordion.Item id="r" header="Membership Rewards">
                        Earn points on eligible purchases.
                      </Accordion.Item>
                      <Accordion.Item id="t" header="Travel benefits">
                        Lounge access and travel credits.
                      </Accordion.Item>
                    </Accordion>
                  </StoryCard>

                  <StoryCard>
                    <StoryHead>
                      <StoryTitle>Single panel only</StoryTitle>
                      <StoryHint>Opening one closes the other</StoryHint>
                    </StoryHead>
                    <Accordion shouldAllowMultipleExpanded={false}>
                      <Accordion.Item id="a" header="Disputing a charge">
                        Disputes can be raised online for up to 60 days.
                      </Accordion.Item>
                      <Accordion.Item id="b" header="Account alerts">
                        Manage push, email, and SMS alerts.
                      </Accordion.Item>
                      <Accordion.Item id="c" header="Lost or stolen card">
                        Replacement is dispatched within one business day.
                      </Accordion.Item>
                    </Accordion>
                  </StoryCard>

                  <StoryCard>
                    <StoryHead>
                      <StoryTitle>With default expanded</StoryTitle>
                      <StoryHint>Travel benefits open on first render</StoryHint>
                    </StoryHead>
                    <Accordion defaultExpandedItems={['travel']}>
                      <Accordion.Item id="rewards" header="Membership Rewards">
                        Earn points on eligible purchases.
                      </Accordion.Item>
                      <Accordion.Item id="travel" header="Travel benefits">
                        Lounge access and statement credits.
                      </Accordion.Item>
                    </Accordion>
                  </StoryCard>

                  <StoryCard>
                    <StoryHead>
                      <StoryTitle>With disabled item</StoryTitle>
                      <StoryHint>Native disabled · skipped in tab order</StoryHint>
                    </StoryHead>
                    <Accordion>
                      <Accordion.Item id="ok-1" header="Disputing a charge">
                        Disputes can be raised online for up to 60 days.
                      </Accordion.Item>
                      <Accordion.Item id="off" header="Autopay (coming soon)" disabled>
                        Autopay setup is temporarily unavailable.
                      </Accordion.Item>
                      <Accordion.Item id="ok-2" header="Account alerts">
                        Manage push, email, and SMS alerts.
                      </Accordion.Item>
                    </Accordion>
                  </StoryCard>

                  <StoryCard>
                    <StoryHead>
                      <StoryTitle>With inline style overrides</StoryTitle>
                      <StoryHint>Coloured left rails via the style prop</StoryHint>
                    </StoryHead>
                    <Accordion>
                      <Accordion.Item
                        id="biz"
                        header="Small business cards"
                        style={{ borderInlineStart: `4px solid ${tokens.amexBlue}` }}
                      >
                        Tools for managing employee cards and expenses.
                      </Accordion.Item>
                      <Accordion.Item
                        id="plat"
                        header="Platinum Card benefits"
                        style={{ borderInlineStart: `4px solid ${tokens.amexAccent}` }}
                      >
                        Travel credits, hotel upgrades, and concierge service.
                      </Accordion.Item>
                    </Accordion>
                  </StoryCard>
                </>
              )}

              {(dialog === 'planned-modal' ||
                dialog === 'planned-toast' ||
                dialog === 'planned-tabs') &&
                (() => {
                  const spec =
                    dialog === 'planned-modal'
                      ? plannedSpecs.modal
                      : dialog === 'planned-toast'
                        ? plannedSpecs.toast
                        : plannedSpecs.tabs;
                  return (
                    <>
                      <KeyValueGrid>
                        <dt>Component</dt>
                        <dd>{spec.name}</dd>
                        <dt>Status</dt>
                        <dd>Planned for {spec.version}</dd>
                        <dt>Pattern</dt>
                        <dd>WAI-ARIA, accessibility-first</dd>
                      </KeyValueGrid>
                      <p>{spec.summary}</p>
                      <PlannedCard aria-label="Component preview placeholder">
                        <strong style={{ fontSize: '0.85rem' }}>
                          Preview placeholder
                        </strong>
                        <PlannedSkeletonRow style={{ width: '60%' }} />
                        <PlannedSkeletonRow style={{ width: '90%' }} />
                        <PlannedSkeletonRow style={{ width: '75%' }} />
                        <span
                          style={{
                            color: tokens.textMuted,
                            fontSize: '0.78rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          The {spec.name} component will render here once it ships.
                        </span>
                      </PlannedCard>
                    </>
                  );
                })()}

              {dialog === 'faq-rewards' && faqMore.rewards.body}
              {dialog === 'faq-partners' && faqMore.partners.body}
              {dialog === 'faq-benefits' && faqMore.benefits.body}
            </DialogBody>

            <DialogFooter>
              <GhostButton type="button" onClick={() => setDialog(null)}>
                Close
              </GhostButton>
            </DialogFooter>
          </DialogShell>
        </>
      )}
    </>
  );
}
