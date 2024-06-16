import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import JoinScreen from '@/components/meeting/JoinScreen';
import NoSsr from '@/components/NoSsr';
import Seo from '@/components/Seo';
import { API_URL } from '@/constant/api';
import { COOKIE_OPTIONS } from '@/constant/cookie';

const createMeeting = async ({ token }: { token?: string }) => {
  if (!token) return undefined;
  console.log(token);
  const { data } = await axios.post(`${API_URL}meeting/create`, { token });
  return data;
};

const isSSR = () => typeof window === 'undefined';

const MeetingConsumer = dynamic(
  () =>
    import('@videosdk.live/react-sdk').then((module) => module.MeetingConsumer),
  { ssr: false },
);
const MeetingProvider = dynamic(
  () =>
    import('@videosdk.live/react-sdk').then((module) => module.MeetingProvider),
  { ssr: false },
);

const Container = dynamic(() => import('@/components/meeting/Container'), {
  ssr: false,
});

const MeetingPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const [meetingId, setMeetingId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get<{ token: string }>(
        `${API_URL}meeting/get-token`,
      );
      setToken(data.token);
    })().finally(() => setLoading(false));
  }, []);

  const getMeetingAndToken = async (id?: string) => {
    const meetingId = id == null ? await createMeeting({ token: token }) : id;
    setMeetingId(meetingId);
  };

  if (loading) {
    return null;
  }

  return (
    <Layout hewwo skipToContent={false}>
      <Seo templateTitle='Meeting' />
      <main>
        <section className=''>
          <div className='layout flex flex-col items-center justify-center gap-y-40 text-center'>
            <Button
              onClick={async () => {
                const res = await createMeeting({ token });
                console.log(res);
                if (!token) return;
                const options = {
                  method: 'POST',
                  headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({}),
                };
                const url = `https://api.videosdk.live/v2/rooms`;
                const response = await fetch(url, options);
                const data = await response.json();
                console.log(data);
              }}
            >
              Create Meeting
            </Button>
            <NoSsr>
              {token && meetingId && !isSSR() ? (
                <MeetingProvider
                  config={{
                    meetingId,
                    micEnabled: true,
                    webcamEnabled: true,
                    name: 'Aaron',
                  }}
                  token={token}
                >
                  <MeetingConsumer>
                    {() => <Container meetingId={meetingId} />}
                  </MeetingConsumer>
                </MeetingProvider>
              ) : (
                <JoinScreen getMeetingAndToken={getMeetingAndToken} />
              )}
            </NoSsr>
          </div>
        </section>
      </main>
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

export default MeetingPage;
