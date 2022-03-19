import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import useSWR from 'swr';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import { TTT } from '@/lib/ttt';

const fetcherTTT = (url: string) => axios.get(url).then((res) => res.data.ttt);

const ChangePassword: NextPage = () => {
  const { data } = useSWR<TTT>('/api/ttt', fetcherTTT, {
    refreshInterval: 1000,
  });

  const handlePlay = (
    e: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    e.preventDefault();

    axios.post('/api/ttt', { x, y });
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    axios.delete('/api/ttt');
  };

  return (
    <Layout>
      <Seo templateTitle='Tic Tac Toe 💕' />
      <main>
        <section className='my-4 text-primary-50'>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
            <div>
              <h1 className='mb-4 text-4xl text-primary-300'>Tic Tac Toe 💕</h1>
            </div>

            {data?.winner || data?.draw ? (
              <h2>
                {data.winner
                  ? `The winner is ${data.winner} !`
                  : "It's a draw !"}
              </h2>
            ) : (
              <h2>
                Player {data?.lastPlay === 'X' ? 'O' : 'X'}
                {"'"}s turn
              </h2>
            )}
            <section className='mx-auto grid h-[454px] w-[454px] grid-cols-3 border-2 border-gray-500'>
              {data?.board.map((row, i) =>
                row.map((col, j) => (
                  <div
                    className='flex h-[150px] w-[150px] cursor-pointer select-none items-center justify-center border border-gray-500 bg-slate-300 text-8xl text-black hover:bg-primary-50'
                    key={`${col}${i}${j}`}
                    onClick={(e) => handlePlay(e, i, j)}
                  >
                    {col}
                  </div>
                ))
              )}
            </section>

            <div className='mt-2'>
              <Button onClick={handleReset}>Reset</Button>
            </div>

            <p className='text-xl text-primary-200'>
              <ArrowLink href='/' openNewTab={false} direction='left'>
                Back To Home
              </ArrowLink>
            </p>
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

export default ChangePassword;
