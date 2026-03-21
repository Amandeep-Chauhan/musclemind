import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/store';
import { lightTheme, darkTheme } from '@/styles/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import { selectTheme, setNotifications } from '@/store/slices/uiSlice';
import { dummyNotifications } from '@/data/dummyData';
import '../styles/globals.css';

// Configure React Query client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 3,      // 3 minutes
      cacheTime: 1000 * 60 * 10,     // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Inner app with access to Redux store
function InnerApp({ Component, pageProps }) {
  const theme = useSelector(selectTheme);
  const activeTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Seed notifications from dummy data
  useEffect(() => {
    store.dispatch(setNotifications(dummyNotifications));
  }, []);

  // Sync theme with <html> class for Tailwind dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('mm-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <InnerApp Component={Component} pageProps={pageProps} />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        )}
      </QueryClientProvider>
    </Provider>
  );
}
