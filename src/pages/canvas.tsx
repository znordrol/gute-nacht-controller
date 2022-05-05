import { Listbox, Switch, Transition } from '@headlessui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import type { GetServerSideProps, NextPage } from 'next';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import CanvasDraw, { MyCanvasDraw } from 'react-canvas-draw';
import { SketchPicker } from 'react-color';
import { Toaster } from 'react-hot-toast';
import { AiOutlineCheck } from 'react-icons/ai';
import { HiSelector } from 'react-icons/hi';
import { Range } from 'react-range';
import useSWR from 'swr';

import Button from '@/components/buttons/Button';
import StyledInput from '@/components/forms/StyledInput';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import { CanvasDataRes } from '@/types/fauna';

const fetcherCanvas = (url: string) => axios.get(url).then((res) => res.data);

declare module 'react-canvas-draw' {
  class MyCanvasDraw extends CanvasDraw {
    ctx: {
      drawing: {
        globalCompositeOperation: string;
      };
    };

    getDataURL(
      fileType?: string,
      useBgImage?: boolean,
      backgroundColor?: string
    ): string;
  }
}

const Canvas: NextPage = () => {
  const { data, mutate } = useSWR<{ canvases: CanvasDataRes[] }>(
    '/api/canvas',
    fetcherCanvas
  );

  const canvasRef = useRef<MyCanvasDraw>(null);

  const [canvas, setCanvas] = useState<CanvasDataRes>();
  const [canvases, setCanvases] = useState<CanvasDataRes[]>();
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#000');
  const [erase, setErase] = useState<boolean>(false);
  const [brushRadius, setBrushRadius] = useState<number>(12);

  const toggleErase = (value: boolean) => {
    if (canvasRef?.current) {
      if (
        canvasRef.current.ctx.drawing.globalCompositeOperation ===
        'destination-out'
      ) {
        canvasRef.current.ctx.drawing.globalCompositeOperation = 'source-over';
      } else {
        canvasRef.current.ctx.drawing.globalCompositeOperation =
          'destination-out';
      }
      setErase(value);
    }
  };

  const getImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const imgUrl = canvasRef?.current?.getDataURL();
    if (!imgUrl) return;
    const newTab = window.open();
    if (!newTab) return;
    newTab.document.body.innerHTML = `<img src="${imgUrl}">`;
  };

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
                  <Listbox.Button className='relative w-full cursor-default rounded-lg bg-gray-300 py-2 pl-3 pr-10 text-left shadow-md transition-colors hover:bg-gray-400 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-gray-600 dark:hover:bg-gray-500 sm:text-sm'>
                    <span className='block truncate'>{canvas?.data.name}</span>
                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                      <HiSelector className='h-5 w-5' aria-hidden='true' />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-in duration-100'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='transition ease-in duration-100'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-300 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm'>
                      {canvases?.map((canvas) => (
                        <Listbox.Option
                          key={canvas.id}
                          className={({ active }) =>
                            `relative z-10 cursor-default select-none py-2 pl-10 pr-4 transition-colors duration-150 ${
                              active ? 'bg-violet-300 dark:bg-violet-500' : ''
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
                  </Transition>
                </div>
              </Listbox>
            </div>
            <StyledInput
              type='text'
              name='name'
              className='mb-4 block w-1/3 rounded-lg border-2 bg-gray-300 p-2 dark:bg-gray-900'
              onChange={(e) => setName(e.target.value)}
              defaultValue={canvas?.data.name}
            />
            <CanvasDraw
              ref={canvasRef}
              saveData={
                canvas?.data.saveData &&
                (decompressFromUTF16(canvas.data.saveData) as string)
              }
              immediateLoading
              canvasHeight={800}
              canvasWidth={800}
              hideGrid
              brushColor={erase ? '#fff' : color}
              brushRadius={brushRadius}
            />
            <SketchPicker
              disableAlpha
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
            <Range
              step={1}
              min={1}
              max={80}
              values={[brushRadius]}
              onChange={(values) => setBrushRadius(values[0])}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '6px',
                    width: '100%',
                    backgroundColor: '#ccc',
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '42px',
                    width: '42px',
                    backgroundColor: '#999',
                  }}
                />
              )}
            />
            <p>Brush Size</p>
            <Switch
              checked={erase}
              onChange={toggleErase}
              className={`${erase ? 'bg-primary-300' : 'bg-gray-400'}
                relative inline-flex h-[38px] w-[74px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className='sr-only'>Erase</span>
              <span
                aria-hidden='true'
                className={`${erase ? 'translate-x-9' : 'translate-x-0'}
                  pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
            <p>Erase Mode</p>
            <Button
              onClick={async (e) => {
                e.preventDefault();
                const saveData = canvasRef.current?.getSaveData();

                saveData &&
                  (await axios.post('/api/canvas', {
                    name: name || canvas?.data.name,
                    saveData: compressToUTF16(saveData),
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
            <Button onClick={getImage}>Export Image</Button>
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
