import { RouterProvider } from 'react-router-dom';
import { router } from './Router';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './theme';
import { auth } from './firebase';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity,
      },
    },
  });
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ThemeProvider theme={defaultTheme}>{isLoading ? null : <RouterProvider router={router} />}</ThemeProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
}
