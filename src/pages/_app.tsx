import '@/styles/globals.css';
import '@/styles/nprogress.css';

import axios from 'axios';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { ThemeProvider } from 'next-themes';
import nProgress from 'nprogress';
import { SWRConfig } from 'swr';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
      <SWRConfig
        value={{
          fetcher: (url) => axios.get(url).then((res) => res.data),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </ThemeProvider>
  );
};

export default MyApp;
