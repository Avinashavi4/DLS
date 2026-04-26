import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { ReactElement } from 'react';

export function renderWithUser(
  ui: ReactElement,
  options?: RenderOptions
): RenderResult & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...render(ui, options),
  };
}
