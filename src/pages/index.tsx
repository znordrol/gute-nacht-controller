import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import Seo from '@/components/Seo';
import { toastStyle } from '@/constant/toast';

const Home: NextPage = () => {
  const [gnLoading, setGnLoading] = useState<boolean>(false);
  const [noGnLoading, setNoGnLoading] = useState<boolean>(false);
  const [yesGnLoading, setYesGnLoading] = useState<boolean>(false);
  const [gnTime, setGnTime] = useState<string>('23:00');

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
  };

  return (
    <>
      <Seo />
      <main>
        <section>
          <div className='layout min-h-screen space-y-10 py-10'>
            <div className='space-y-8'>
              <h1>Halooo {'<3'}</h1>
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
              <form onSubmit={handleGnTime}>
                <input
                  type='time'
                  value={gnTime}
                  className='form-control'
                  placeholder='Time'
                  onChange={(e) => setGnTime(e.target.value)}
                />
                <div className='mt-4'>
                  <Button className='bg-rose-300'>
                    Good night buat ntar 💚
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
    </>
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
