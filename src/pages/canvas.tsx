import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Toaster } from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';

const Canvas: NextPage = () => {
  const canvasRef = useRef<CanvasDraw>(null);

  const [saveData, setSaveData] = useState<string>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSaveData(localStorage.getItem('savedDrawing') ?? undefined);
    }
  }, []);

  return (
    <Layout>
      <Seo templateTitle='Tic Tac Toe 💕' />
      <main>
        <section className='my-4 text-primary-50'>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
            <div>
              <h1 className='mb-4 text-4xl text-primary-300'>Tic Tac Toe 💕</h1>
            </div>
            <input
              type='text'
              name='name'
              className='mb-4 block rounded-lg border-2 border-primary-300 bg-gray-900 p-2'
              onChange={(e) => setName(e.target.value)}
            />
            <CanvasDraw ref={canvasRef} saveData={saveData} />
            <Button
              onClick={(e) => {
                e.preventDefault();
                const saveData = canvasRef.current?.getSaveData();

                saveData && axios.post('/api/canvas', { name, saveData });
              }}
            >
              Save
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                canvasRef.current?.clear();
              }}
            >
              Clear
            </Button>
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

export default Canvas;
