import { Tab } from '@headlessui/react';
import { lastDayOfMonth } from 'date-fns';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Accent from '@/components/Accent';
import AnimatedL from '@/components/AnimatedL';
import Confettia from '@/components/Confetti';
import Counter, {
  getAnnualCountdownDate,
  isADayAfter,
} from '@/components/Counter';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import clsxm from '@/lib/clsxm';

const tabs = ['HBD <3', 'Anniv ❤️'];
const queryTab = ['hbd', 'anniv'];

const Countdown: NextPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const [hbdTia, hbdAku, anniv, mensive] = [
    new Date(new Date().getFullYear(), 10, 2, 11, 0, 0),
    new Date(new Date().getFullYear(), 11, 8, 0, 0, 0),
    new Date(new Date().getFullYear(), 2, 30, 0, 0, 0),
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getMonth() === 1 ? lastDayOfMonth(new Date()).getDate() : 30,
      0,
      0,
      0
    ),
  ];

  const fireConfettia = [hbdTia, hbdAku, anniv, mensive].some((a) =>
    isADayAfter(a)
  );

  useEffect(() => {
    if (!router.isReady) return;
    const { tab } = router.query;
    for (let i = 0; i < queryTab.length; ++i) {
      if (tab === queryTab[i]) {
        setSelectedIndex(i);
        return;
      }
    }
  }, [router.isReady, router.query]);

  return (
    <Layout>
      <Seo templateTitle='💕 Countdown for Tia' />
      <main>
        <section className='my-4 text-primary-50'>
          <div className='layout flex flex-col items-center justify-center gap-y-10 text-center'>
            {fireConfettia && <Confettia />}
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            >
              <Tab.List className='flex space-x-1 rounded-xl bg-blue-900/20 p-1'>
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      clsxm(
                        'w-24 rounded-lg py-2.5 text-sm font-medium leading-5 text-red-700',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-rose-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-gray-300 shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel className='flex flex-col items-center justify-center gap-y-40 text-center'>
                  <div className='space-y-8'>
                    <h1>
                      <Accent>
                        Countdown ultah Tia{' '}
                        <span className='text-red-400'>❤️</span>
                      </Accent>
                    </h1>
                    <Counter
                      className='text-2xl md:text-5xl'
                      endDate={getAnnualCountdownDate(
                        new Date(new Date().getFullYear(), 10, 2, 11, 0, 0)
                      )}
                    />
                  </div>
                  <div className='space-y-8'>
                    <h2 className='text-lg md:text-xl'>
                      Ini punyaku seh wkwk gausah diliat
                    </h2>
                    <Counter
                      className='text-sm md:text-3xl'
                      endDate={getAnnualCountdownDate(
                        new Date(new Date().getFullYear(), 11, 8, 0, 0, 0)
                      )}
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel className='flex flex-col items-center justify-center gap-y-40 text-center'>
                  <div className='mb-12 flex flex-col items-center justify-center space-y-8 text-center'>
                    <h1>
                      <Accent>
                        <span className='text-red-400'>❤️</span> Countdown Anniv
                        kyta <span className='text-red-400'>❤️</span>
                      </Accent>
                    </h1>
                    <h2>30 Maret 2022</h2>
                    <AnimatedL
                      d='m188 171.61c-89.237-163.62-178.47 38.5 0 144.38 178.47-105.88 89.24-308 0-144.38z'
                      stroke='#f00'
                    />
                    <Counter
                      className='text-3xl md:text-5xl'
                      endDate={getAnnualCountdownDate(
                        new Date(new Date().getFullYear(), 2, 30, 0, 0, 0)
                      )}
                    />
                    <div className='space-y-8'>
                      <h2 className='mt-20'>
                        <Accent>
                          <span className='text-red-400'>❤️</span> Mensiversary{' '}
                          <span className='text-red-400'>❤️</span>
                        </Accent>
                      </h2>
                      <Counter
                        className='text-xl md:text-3xl'
                        endDate={
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getMonth() === 1
                              ? lastDayOfMonth(new Date()).getDate()
                              : 30,
                            0,
                            0,
                            0
                          )
                        }
                      />
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
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

export default Countdown;
