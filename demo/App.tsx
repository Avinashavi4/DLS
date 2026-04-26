import styled from 'styled-components';
import { Accordion } from '../src';

const Page = styled.main`
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  color: #1a1a1a;
`;

const Section = styled.section`
  & + & {
    margin-top: 2.5rem;
  }
`;

const Heading = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
`;

const Hint = styled.p`
  margin: 0 0 1rem;
  color: #555;
  font-size: 0.9rem;
`;

export function App() {
  return (
    <Page>
      <h1>DLS Accordion</h1>
      <p>
        Demo page for the component. Run <code>npm run storybook</code> for the full set
        of variations.
      </p>

      <Section>
        <Heading>Default — multiple panels open</Heading>
        <Hint>Try clicking more than one header.</Hint>
        <Accordion>
          <Accordion.Item id="shipping" header="Shipping & delivery">
            Standard delivery is 3–5 working days. Express delivery arrives next working
            day if you order before 3pm.
          </Accordion.Item>
          <Accordion.Item id="returns" header="Returns policy">
            You can return any item within 30 days for a full refund. The item must be in
            its original condition.
          </Accordion.Item>
          <Accordion.Item id="contact" header="Contact us">
            Reach our support team Mon–Fri, 9am to 6pm via chat or email.
          </Accordion.Item>
        </Accordion>
      </Section>

      <Section>
        <Heading>Single-open mode</Heading>
        <Hint>Opening a new panel closes the previous one.</Hint>
        <Accordion shouldAllowMultipleExpanded={false}>
          <Accordion.Item id="q1" header="What is your refund window?">
            30 days from the date of delivery.
          </Accordion.Item>
          <Accordion.Item id="q2" header="Do you ship internationally?">
            Yes — to most countries in Europe and North America.
          </Accordion.Item>
          <Accordion.Item id="q3" header="How do I track my order?">
            You&apos;ll get a tracking link by email once your order ships.
          </Accordion.Item>
        </Accordion>
      </Section>
    </Page>
  );
}
