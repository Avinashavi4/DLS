import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// `vite` (dev) serves the demo page from /demo.
// `vite build` (production) emits the library bundle to /dist.
export default defineConfig(({ mode }) => {
  const isLibBuild = mode === 'production';

  return {
    plugins: [
      react(),
      isLibBuild &&
        dts({
          include: ['src'],
          exclude: ['**/*.test.*', '**/*.stories.*', 'src/test/**'],
        }),
    ].filter(Boolean),

    root: isLibBuild ? undefined : 'demo',

    build: isLibBuild
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'DlsAccordion',
            fileName: 'index',
            formats: ['es'],
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', 'styled-components'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'styled-components': 'styled',
              },
            },
          },
        }
      : undefined,
  };
});
