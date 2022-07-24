import 'react-responsive-modal/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';

import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import { ThemeProvider, useTheme } from 'next-themes';
import NextNProgress from 'nextjs-progressbar';
import type { Theme } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

import ScrollButton from '@/components/ScrollButton';
import getFromLocalStorage from '@/lib/getFromLocalStorage';

declare module 'next-themes' {
  interface ThemeProviderProps {
    children: React.ReactNode;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { theme } = useTheme();

  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
      <NextNProgress
        color='#eb2754'
        startPosition={0.2}
        options={{ showSpinner: false }}
      />
      <SWRConfig
        value={{
          fetcher: (url) => axios.get(url).then((res) => res.data),
        }}
      >
        <AnimatePresence
          exitBeforeEnter
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <Component {...pageProps} />
          <ToastContainer
            theme={(getFromLocalStorage('theme') as Theme) ?? theme ?? 'dark'}
          />
        </AnimatePresence>
        <ScrollButton />
      </SWRConfig>
    </ThemeProvider>
  );
};

export default MyApp;
