import { Menu, Transition } from '@headlessui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiChevronDown } from 'react-icons/fi';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import { toastStyle } from '@/constant/toast';
import clsxm from '@/lib/clsxm';

const Home: NextPage = () => {
  const [gnLoading, setGnLoading] = useState<boolean>(false);
  const [noGnLoading, setNoGnLoading] = useState<boolean>(false);
  const [yesGnLoading, setYesGnLoading] = useState<boolean>(false);
  const [gnTimeLoading, setGnTimeLoading] = useState<boolean>(false);
  const [gnTime, setGnTime] = useState<string>('23:00');

  const router = useRouter();

  const handleGuteNacht = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setGnLoading(true);

    toast
      .promise(axios.get('/api/gute-nacht'), {
        loading: 'Loading...',
        success: () => {
          return 'Bentar lagi kekirim good nightnya 🌝😴🥰';
        },
        error: (err: Error) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Waduh error 😭😭, segera panggil akuu';
        },
      })
      .then(() => {
        setGnLoading(false);
      });
  };

  const handleNoGuteNacht = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setNoGnLoading(true);

    toast
      .promise(axios.get('/api/no-gn'), {
        loading: 'Loading...',
        success: () => {
          return 'Good nightnya dicancel :(( 😭😭';
        },
        error: (err: Error) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Waduh error 😭😭, segera panggil akuu';
        },
      })
      .then(() => {
        setNoGnLoading(false);
      });
  };

  const handleYesGuteNacht = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setYesGnLoading(true);

    toast
      .promise(axios.get('/api/yes-gn'), {
        loading: 'Loading...',
        success: () => {
          return 'Good night buat ntar malem  🥰';
        },
        error: (err: Error) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Waduh error 😭😭, segera panggil akuu';
        },
      })
      .then(() => {
        setYesGnLoading(false);
      });
  };

  const handleGnTime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setGnTimeLoading(true);

    toast
      .promise(axios.post('/api/gn-time', { time: gnTime }), {
        loading: 'Loading...',
        success: () => {
          return 'Waktu good nightnya udh keganti yayy 😊';
        },
        error: (err: Error) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Waduh error 😭😭, segera panggil akuu';
        },
      })
      .then(() => setGnTimeLoading(false));
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    toast.promise(axios.post('/api/logout', {}), {
      loading: 'Loading...',
      success: () => {
        setTimeout(() => router.push('/login'), 2000);
        return 'Logged out !, will miss you 😭';
      },
      error: (err: Error) => {
        if (axios.isAxiosError(err)) {
          return err.response?.data.message ?? err.message;
        }
        return 'Waduh error 😭😭, segera panggil akuu';
      },
    });
  };

  return (
    <Layout>
      <Seo />
      <main>
        <section>
          <div className='layout min-h-screen space-y-10 py-10'>
            <div className='space-y-8'>
              <div className='flex'>
                <h1>Halooo {'<3'}</h1>
                <aside className='absolute left-[85%] z-10'>
                  <Menu as='div' className='relative inline-block text-left'>
                    <div>
                      <Menu.Button
                        className={clsxm(
                          'inline-flex items-center rounded px-4 py-2 font-semibold',
                          'focus:outline-none focus-visible:ring focus-visible:ring-primary-500',
                          'shadow-sm',
                          'animate-shadow scale-100 transform-gpu transition duration-300 hover:scale-[1.03] active:scale-[0.97]',
                          'bg-primary-300 text-black',
                          'border border-primary-500',
                          'hover:bg-primary-500 hover:text-primary-50',
                          'active:bg-primary-600'
                        )}
                      >
                        Akun
                        <FiChevronDown className='text-2xl' />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md bg-gray-700 shadow-lg ring-1 ring-light ring-opacity-5 focus:outline-none'>
                        <div className='px-1 py-1 '>
                          <Menu.Item>
                            {({ active }) => (
                              <UnstyledLink
                                href='/change-password'
                                className={`${
                                  active
                                    ? 'bg-violet-500 text-white'
                                    : 'text-gray-100'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                Ganti Password
                              </UnstyledLink>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? 'bg-violet-500 text-white'
                                    : 'text-gray-100'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                onClick={handleLogout}
                              >
                                Log Out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </aside>
              </div>
              <h2>Ini kamu bisa ngatur webhook good night nya di sini</h2>
            </div>
            <div
              className='space-y-4 rounded-lg border-2 border-primary-200 p-4'
              id='goodnight'
            >
              <h3>Jalankan good nightnya sekarang juga 💕</h3>
              <p>
                Kalo kamu mencet tombol ini, nanti langsung kekirim good
                nightnya, kalo ga error v:
              </p>
              <p>Oh iya, jgn dipencet terus-terusan ya wkwk :v</p>
              <Button
                className='bg-rose-300'
                onClick={handleGuteNacht}
                isLoading={gnLoading}
              >
                Good nightt 💝
              </Button>
            </div>
            <div
              className='space-y-4 rounded-lg border-2 border-primary-200 p-4'
              id='nogoodnight'
            >
              <h3>Tunda good nightnya untuk hari ini</h3>
              <p>
                Kalo kamu mencet tombol ini, nanti bot/webhooknya ga ngucapin
                good night buat hari ini v:
              </p>
              <Button
                className='bg-rose-300'
                onClick={handleNoGuteNacht}
                isLoading={noGnLoading}
              >
                No good night 😭
              </Button>
            </div>
            <div
              className='space-y-4 rounded-lg border-2 border-primary-200 p-4'
              id='yesgoodnight'
            >
              <h3>Enable good nightnya untuk hari ini</h3>
              <p>
                Kalo kamu mencet tombol ini, nanti bot/webhooknya akan ngucapin
                good night buat hari ini v:. Kalo ga diotak atik udh default sih
                ini.
              </p>
              <Button
                className='bg-rose-300'
                onClick={handleYesGuteNacht}
                isLoading={yesGnLoading}
              >
                Good night buat ntar 💚
              </Button>
            </div>
            <div
              className='space-y-4 rounded-lg border-2 border-primary-200 p-4'
              id='goodnighttime'
            >
              <h3>Ganti waktu good nightnya</h3>
              <p>Delaynya +- 30 menit -{'>'} 1 jam</p>
              <form onSubmit={handleGnTime}>
                <input
                  type='time'
                  value={gnTime}
                  className='form-control'
                  placeholder='Time'
                  onChange={(e) => setGnTime(e.target.value)}
                />
                <div className='mt-4'>
                  <Button
                    className='bg-rose-300'
                    type='submit'
                    isLoading={gnTimeLoading}
                  >
                    Ganti waktunya 😊
                  </Button>
                </div>
              </form>
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
  {
    cookieName: 'cookie_ini_khusus_buatmu',
    password: process.env.COOKIE_PASS as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);

export default Home;
