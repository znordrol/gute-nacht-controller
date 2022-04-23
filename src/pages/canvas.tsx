import { Listbox } from '@headlessui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Toaster } from 'react-hot-toast';
import { AiOutlineCheck } from 'react-icons/ai';
import { HiSelector } from 'react-icons/hi';
import useSWR from 'swr';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import { CanvasDataRes } from '@/types/fauna';

const fetcherCanvas = (url: string) => axios.get(url).then((res) => res.data);

const Canvas: NextPage = () => {
  const { data, mutate } = useSWR<{ canvases: CanvasDataRes[] }>(
    '/api/canvas',
    fetcherCanvas
  );

  const canvasRef = useRef<CanvasDraw>(null);

  const [canvas, setCanvas] = useState<CanvasDataRes>();
  const [canvases, setCanvases] = useState<CanvasDataRes[]>();
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (data) {
      setCanvases(data.canvases);
      if (!canvas) setCanvas(data.canvases[0]);
    }
  }, [canvas, data]);

  return (
    <Layout>
      <Seo templateTitle='Canvas 💕' />
      <main>
        <section className='my-4'>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
            <div>
              <h1 className='mb-4 text-4xl text-primary-300'>Canvas 💕</h1>
            </div>
            <div className='w-72'>
              <Listbox value={canvas} onChange={setCanvas}>
                <div className='relative mt-1'>
                  <Listbox.Button className='relative w-full cursor-default rounded-lg bg-gray-600 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
                    <span className='block truncate'>{canvas?.data.name}</span>
                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                      <HiSelector
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                    {canvases?.map((canvas) => (
                      <Listbox.Option
                        key={canvas.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-100'
                          }`
                        }
                        value={canvas}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {canvas.data.name}
                            </span>
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                                <AiOutlineCheck
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <input
              type='text'
              name='name'
              className='mb-4 block rounded-lg border-2 border-primary-300 bg-gray-900 p-2'
              onChange={(e) => setName(e.target.value)}
              defaultValue={canvas?.data.name}
            />
            <CanvasDraw
              ref={canvasRef}
              saveData={canvas?.data.saveData}
              immediateLoading
              canvasHeight={800}
              canvasWidth={800}
            />
            <Button
              onClick={async (e) => {
                e.preventDefault();
                const saveData = canvasRef.current?.getSaveData();

                saveData &&
                  (await axios.post('/api/canvas', {
                    name: name || canvas?.data.name,
                    saveData,
                  }));
                mutate();
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
