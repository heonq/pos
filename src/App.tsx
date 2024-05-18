import { RouterProvider } from 'react-router-dom';
import { router } from './Router';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './theme';
import { auth } from './firebase';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App() {
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
