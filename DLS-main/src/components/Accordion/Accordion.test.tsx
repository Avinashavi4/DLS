import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithUser } from '../../test/renderWithUser';
import { Accordion } from './Accordion';

function renderAccordion(props: { shouldAllowMultipleExpanded?: boolean } = {}) {
  return (
    <Accordion {...props}>
      <Accordion.Item id="one" header="Panel one">
        Content for panel one
      </Accordion.Item>
      <Accordion.Item id="two" header="Panel two">
        Content for panel two
      </Accordion.Item>
      <Accordion.Item id="three" header="Panel three">
        Content for panel three
      </Accordion.Item>
    </Accordion>
  );
}

// A11y assertions need at least one panel open so a region exists in the DOM —
// collapsed panels are not rendered.
function renderAccordionWithAllOpen() {
  return (
    <Accordion defaultExpandedItems={['one', 'two', 'three']}>
      <Accordion.Item id="one" header="Panel one">
        Content for panel one
      </Accordion.Item>
      <Accordion.Item id="two" header="Panel two">
        Content for panel two
      </Accordion.Item>
      <Accordion.Item id="three" header="Panel three">
        Content for panel three
      </Accordion.Item>
    </Accordion>
  );
}

describe('Accordion', () => {
  test('renders accordion with multiple panels', () => {
    render(renderAccordion());
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.queryByText('Content for panel one')).toBeNull();
    expect(screen.queryByText('Content for panel two')).toBeNull();
    expect(screen.queryByText('Content for panel three')).toBeNull();
  });

  test('shows content for the clicked panel and hides the rest', async () => {
    const { user } = renderWithUser(renderAccordion());
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);
    expect(screen.getByText('Content for panel two')).toBeVisible();
    expect(screen.queryByText('Content for panel one')).toBeNull();
    expect(screen.queryByText('Content for panel three')).toBeNull();
  });

  test('hides content when an expanded panel is clicked again', async () => {
    const { user } = renderWithUser(renderAccordion());
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[2]);
    expect(screen.getByText('Content for panel three')).toBeVisible();
    await user.click(buttons[2]);
    expect(screen.queryByText('Content for panel three')).toBeNull();
  });

  test('can expand multiple panels at the same time by default', async () => {
    const { user } = renderWithUser(renderAccordion());
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[2]);
    expect(screen.getByText('Content for panel one')).toBeVisible();
    expect(screen.queryByText('Content for panel two')).toBeNull();
    expect(screen.getByText('Content for panel three')).toBeVisible();
  });

  describe('when shouldAllowMultipleExpanded is false', () => {
    test('only one panel is visible at a time', async () => {
      const { user } = renderWithUser(
        renderAccordion({ shouldAllowMultipleExpanded: false })
      );
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      expect(screen.getByText('Content for panel one')).toBeVisible();
      await user.click(buttons[2]);
      expect(screen.getByText('Content for panel three')).toBeVisible();
      expect(screen.queryByText('Content for panel one')).toBeNull();
    });
  });

  describe('accessibility', () => {
    test('each button has aria-controls pointing to its content region', () => {
      render(renderAccordionWithAllOpen());
      screen.getAllByRole('button').forEach((button) => {
        const controlsId = button.getAttribute('aria-controls');
        expect(controlsId).toBeTruthy();
        expect(document.getElementById(controlsId!)).toBeInTheDocument();
      });
    });

    test('content regions have aria-labelledby pointing back to their header', () => {
      render(renderAccordionWithAllOpen());
      screen.getAllByRole('region', { hidden: true }).forEach((region) => {
        const labelledBy = region.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(labelledBy!)).toBeInTheDocument();
      });
    });
  });

  describe('style and className overrides', () => {
    test('forwards className and style to the root element', () => {
      render(
        <Accordion className="custom-root" style={{ maxWidth: 600 }}>
          <Accordion.Item id="a" header="A">
            A body
          </Accordion.Item>
        </Accordion>
      );
      const root = screen.getByTestId('dls-accordion');
      expect(root).toHaveClass('custom-root');
      expect(root).toHaveStyle({ maxWidth: '600px' });
    });

    test('forwards className and style to each item wrapper', () => {
      render(
        <Accordion>
          <Accordion.Item
            id="a"
            header="A"
            className="custom-item"
            style={{ borderInlineStart: '4px solid rgb(0, 111, 207)' }}
          >
            A body
          </Accordion.Item>
        </Accordion>
      );
      const item = document.querySelector('[data-item-id="a"]')!;
      expect(item).toHaveClass('custom-item');
      expect(item).toHaveStyle({ borderInlineStart: '4px solid rgb(0, 111, 207)' });
    });
  });
});
