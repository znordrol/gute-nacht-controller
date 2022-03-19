import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import Accent from '@/components/Accent';
import Counter from '@/components/Counter';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';

const HBDCountdown: NextPage = () => {
  return (
    <Layout>
      <Seo templateTitle='HBD Tia 💕 Countdown' />
      <main>
        <section className='my-4 text-primary-50'>
          <div className='layout flex flex-col items-center justify-center gap-y-40 text-center'>
            <div className='space-y-8'>
              <h1>
                <Accent>
                  Countdown ultah Tia <span className='text-red-400'>❤️</span>
                </Accent>
              </h1>
              <Counter
                className='text-2xl md:text-5xl'
                endDate={new Date(2022, 10, 2, 11, 0, 0)}
              />
            </div>
            <div className='space-y-8'>
              <h2 className='text-lg md:text-xl'>
                Ini punyaku seh wkwk gausah diliat
              </h2>
              <Counter
                className='text-sm md:text-3xl'
                endDate={new Date(2022, 11, 8, 0, 0, 0)}
              />
            </div>
          </div>
        </section>
      </main>
      <Toaster
        toastOptions={{
          style: toastStyle,
          loading: {
            iconTheme: {
              primary: '#eb2754',
              secondary: 'black',
            },
          },
        }}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user;

    if (!user || user?.admin !== true) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  COOKIE_OPTIONS
);

export default HBDCountdown;
