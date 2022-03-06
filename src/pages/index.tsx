import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';

import Button from '@/components/buttons/Button';
import Seo from '@/components/Seo';

const Home: NextPage = () => {
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
              <Button className='bg-rose-300'>Good nightt 💝</Button>
            </div>
            <div
              className='space-y-4 rounded-lg border-2 border-primary-200 p-4'
              id='goodnight'
            >
              <h3>Tunda good nightnya untuk hari ini</h3>
              <Button className='bg-rose-300'>No good night 😭</Button>
            </div>
            <div
              className='space-y-4 rounded-lg border-2 border-primary-200 p-4'
              id='goodnight'
            >
              <h3>Enable good nightnya untuk hari ini</h3>
              <Button className='bg-rose-300'>Good night buat ntar 💚</Button>
            </div>
            <div
              className='space-y-4 rounded-lg border-2 border-primary-200 p-4'
              id='goodnight'
            >
              <h3>Ganti waktu good nightnya</h3>
              <Button className='bg-rose-300'>Good night buat ntar 💚</Button>
            </div>
          </div>
        </section>
      </main>
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
