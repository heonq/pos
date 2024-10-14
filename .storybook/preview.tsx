import React from 'react';
import { RecoilRoot } from 'recoil';
import type { Preview } from '@storybook/react';
import { GlobalStyle } from '../src/Root';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../src/theme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const customViewports = {
  Default: {
    name: 'Default',
    styles: {
      width: '100%',
      height: '100%',
      zoom: '0.85',
    },
  },
};

const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: { ...customViewports },
      defaultViewport: 'Default',
    },
  },
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecoilRoot>
              <ThemeProvider theme={defaultTheme}>
                <GlobalStyle />
                <Story />
              </ThemeProvider>
            </RecoilRoot>
          </MemoryRouter>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
