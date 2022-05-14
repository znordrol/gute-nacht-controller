import axios, { AxiosError } from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import AnimatePage from '@/components/AnimatePage';
import Button from '@/components/buttons/Button';
import StyledInput from '@/components/forms/StyledInput';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import type { LoginResponse } from '@/pages/api/login';
import { ErrorResponse } from '@/types/api';
import jibril from '~/images/jibril.png';

const ChangePassword: NextPage = () => {
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      axios.post<LoginResponse>('/api/change-password', {
        password,
        newPassword,
      }),
      {
        loading: 'Loading...',
        success: () => {
          setTimeout(() => router.push('/login'), 2000);
          return 'Ganti password berhasil !, login lagi yaa 🥰🥰!';
        },
        error: (err: Error | AxiosError<ErrorResponse>) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Yah ganti passwordnya menggagal 😭😭, segera panggil akuu';
        },
      }
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewPassword(e.target.value);
  };

  return (
    <Layout trueFooter>
      <Seo templateTitle='Change Password' />
      <AnimatePage>
        <main>
          <section className='bg-black text-primary-50'>
            <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
              <div>
                <h1 className='mb-4 text-4xl text-primary-300'>
                  Ganti Password
                </h1>
                <Image src={jibril} alt='Jibril' width={100} height={100} />
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor='password'>Password Lama</label>
                <StyledInput
                  type='password'
                  name='password'
                  className='mb-4 block rounded-lg border-2 bg-gray-300 p-2 dark:bg-gray-900'
                  onChange={handlePasswordChange}
                />
                <label htmlFor='password'>Password Baru</label>
                <StyledInput
                  type='password'
                  name='password'
                  className='mb-4 block rounded-lg border-2 bg-gray-300 p-2 dark:bg-gray-900'
                  onChange={handleNewPasswordChange}
                />
                <div className='mt-2'>
                  <Button type='submit'>Submit</Button>
                </div>
              </form>

              <p className='text-xl text-primary-200'>
                <ArrowLink href='/' openNewTab={false} direction='left'>
                  Back To Home
                </ArrowLink>
              </p>
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
  COOKIE_OPTIONS
);

export default ChangePassword;
