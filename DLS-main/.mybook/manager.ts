import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

addons.setConfig({
  showToolbar: false,
  theme: create({
    base: 'dark',
    brandTitle: 'MyBook',
    brandUrl: '/',
    brandTarget: '_self',
  }),
});
