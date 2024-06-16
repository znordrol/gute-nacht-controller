import { Tab } from '@headlessui/react';
import { lastDayOfMonth } from 'date-fns';
import { intervalToDuration } from 'date-fns';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Accent from '@/components/Accent';
import AnimatedL from '@/components/AnimatedL';
import AnimatePage from '@/components/AnimatePage';
import Confettia from '@/components/Confettia';
import Counter, {
  getAnnualCountdownDate,
  getMonthlyCountdownDate,
  isADayAfter,
} from '@/components/Counter';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Tooltip from '@/components/Tooltip';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import useWindowFocus from '@/hooks/useWindowFocus';
import clsxm from '@/lib/clsxm';

const tabs = ['HBD <3', 'Anniv ❤️'];
const queryTab = ['hbd', 'anniv'];

const Countdown: NextPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
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
      0,
    ),
  ];

  const fireConfettia = [hbdTia, hbdAku, anniv, mensive].some((a) =>
    isADayAfter(a),
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const windowFocused = useWindowFocus();

  return (
    <Layout trueFooter>
      <Seo templateTitle='💕 Countdown for Tia' />
      <AnimatePage>
        <main>
          <section className='my-4'>
            <div className='layout flex flex-col items-center justify-center gap-y-10 text-center'>
              {mounted && fireConfettia && windowFocused && <Confettia />}
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
                          'w-24 rounded-lg py-2.5 text-sm font-medium leading-5 text-red-700 transition-all duration-300',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-rose-400 focus:outline-none focus:ring-2',
                          selected
                            ? 'bg-gray-300 shadow'
                            : 'text-dark hover:bg-white/[0.12] hover:text-white dark:text-blue-100',
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
                          Countdown ultah{' '}
                          <Tooltip interactive content='I ❤️ You'>
                            Tia <span className='text-red-400'>❤️</span>
                          </Tooltip>
                        </Accent>
                      </h1>
                      <Counter
                        className='text-xl md:text-2xl'
                        numberClassName='text-2xl md:text-5xl'
                        colWrapperClassName='px-6'
                        endDate={getAnnualCountdownDate(hbdTia)}
                      />
                    </div>
                    <div className='space-y-8'>
                      <h2 className='text-lg md:text-xl'>
                        Ini punyaku seh wkwk gausah diliat
                      </h2>
                      <Counter
                        className='text-xs md:text-xl'
                        numberClassName='text-sm md:text-3xl'
                        endDate={getAnnualCountdownDate(hbdAku)}
                      />
                    </div>
                  </Tab.Panel>
                  <Tab.Panel className='flex flex-col items-center justify-center gap-y-40 text-center'>
                    <div className='mb-12 flex flex-col items-center justify-center space-y-8 text-center'>
                      <h1>
                        <Accent>
                          <span className='text-red-400'>❤️</span> Countdown
                          Anniv kyta <span className='text-red-400'>❤️</span>
                        </Accent>
                      </h1>
                      <h2>
                        30 Maret 2022,{' '}
                        <span className='text-rose-500 dark:text-rose-300'>
                          #
                          {
                            intervalToDuration({
                              start: new Date(2022, 2, 30),
                              end: new Date(),
                            }).years
                          }
                        </span>
                      </h2>
                      <AnimatedL
                        d='m188 171.61c-89.237-163.62-178.47 38.5 0 144.38 178.47-105.88 89.24-308 0-144.38z'
                        stroke='#f00'
                      />
                      <Counter
                        className='text-xl md:text-2xl'
                        colWrapperClassName='px-6'
                        numberClassName='text-3xl md:text-5xl'
                        endDate={getAnnualCountdownDate(anniv)}
                      />
                      <div className='space-y-8'>
                        <h2 className='mt-20'>
                          <Accent>
                            <span className='text-red-400'>❤️</span>{' '}
                            Mensiversary{' '}
                            <span className='text-red-400'>❤️</span>
                          </Accent>
                        </h2>
                        <h2 className='text-rose-500 dark:text-rose-300'>
                          #
                          {
                            intervalToDuration({
                              start: new Date(2022, 2, 30),
                              end: new Date(),
                            }).months
                          }
                        </h2>
                        <Counter
                          className='text-base md:text-xl'
                          numberClassName='text-xl md:text-3xl'
                          endDate={getMonthlyCountdownDate(mensive)}
                        />
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </section>
        </main>
      </AnimatePage>
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
  COOKIE_OPTIONS,
);

export default Countdown;
