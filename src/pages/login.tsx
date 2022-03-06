import axios from 'axios';
import type { NextPage } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import type { LoginResponse } from '@/pages/api/login';

import shouko from '../../public/images/nishimiya_shouko.jpg';

const toastStyle = { background: '#333', color: '#eee' };

const Login: NextPage = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      axios.post<LoginResponse>('/api/login', {
        name,
        password,
      }),
      {
        loading: 'Loading...',
        success: () => {
          return 'Logged in !, guten morgen sir!';
        },
        error: (err: Error) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Login failed, who tf are you';
        },
      }
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  return (
    <>
      <Seo templateTitle='Login' />
      <main>
        <section className='bg-black text-primary-50'>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
            <div>
              <h1 className='mb-4 text-4xl text-primary-300'>Login</h1>
              <Image
                src={shouko}
                alt='Shouko Nishimiya'
                width={100}
                height={100}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                name='name'
                className='mb-4 block rounded-lg border-2 border-primary-300 bg-gray-900 p-2'
                onChange={handleNameChange}
              />
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                className='mb-4 block rounded-lg border-2 border-primary-300 bg-gray-900 p-2'
                onChange={handlePasswordChange}
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
    </>
  );
};

export default Login;
