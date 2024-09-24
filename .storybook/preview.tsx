import React from 'react';
import { RecoilRoot } from 'recoil';
import type { Preview } from '@storybook/react';
import { GlobalStyle } from '../src/Root';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../src/theme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
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
