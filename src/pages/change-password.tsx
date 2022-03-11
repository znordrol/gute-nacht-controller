import axios from 'axios';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import { toastStyle } from '@/constant/toast';
import type { LoginResponse } from '@/pages/api/login';

import jibril from '../../public/images/jibril.png';

const Login: NextPage = () => {
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
        error: (err: Error) => {
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
    <Layout>
      <Seo templateTitle='Change Password' />
      <main>
        <section className='bg-black text-primary-50'>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
            <div>
              <h1 className='mb-4 text-4xl text-primary-300'>Ganti Password</h1>
              <Image src={jibril} alt='Jibril' width={100} height={100} />
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor='password'>Password Lama</label>
              <input
                type='password'
                name='password'
                className='mb-4 block rounded-lg border-2 border-primary-300 bg-gray-900 p-2'
                onChange={handlePasswordChange}
              />
              <label htmlFor='password'>Password Baru</label>
              <input
                type='password'
                name='password'
                className='mb-4 block rounded-lg border-2 border-primary-300 bg-gray-900 p-2'
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

export default Login;
