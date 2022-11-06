import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Fragment } from 'react';
import { FiMenu } from 'react-icons/fi';

import Accent from '@/components/Accent';
import ColorModeToggle from '@/components/ColorModeToggle';
import UnstyledLink from '@/components/links/UnstyledLink';
import PageProgress from '@/components/PageProgress';
import clsxm from '@/lib/clsxm';

type Links = {
  href: string;
  label: string;
}[];

const links: Links = [
  { href: '/ttt', label: 'TicTacToe' },
  { href: '/countdown', label: 'Countdown' },
  { href: '/particles', label: 'Particles' },
];

type HeaderProp = {
  skipToContent?: boolean;
};

const Header = ({ skipToContent = true }: HeaderProp): JSX.Element => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className='bg-gray-300 dark:bg-neutral-700'>
      <PageProgress color='#ff9a9a' />
      {skipToContent && (
        <a
          href='#skip-nav'
          className={clsxm(
            'rounded-sm p-2 transition',
            'font-medium text-dark dark:text-white',
            'bg-light dark:bg-dark',
            'group dark:hover:text-primary-300',
            'focus:outline-none focus:ring focus:ring-primary-300',
            'absolute top-4 left-4 z-[1000]',
            '-translate-y-16 focus:translate-y-0'
          )}
        >
          <Accent>I love you so much</Accent>
        </a>
      )}
      <ul className='flex items-center justify-between px-8 py-4'>
        <li className='z-10'>
          <ul className='flex items-center justify-between space-x-8'>
            <li>
              <Link
                href='/'
                className='font-bold transition-all duration-200 hover:text-primary-300'
              >
                Home
              </Link>
            </li>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`} className='hidden md:list-item'>
                <UnstyledLink
                  href={href}
                  className='transition-all duration-200 hover:text-primary-300'
                >
                  {label}
                </UnstyledLink>
              </li>
            ))}
          </ul>
        </li>
        <li className='z-10'>
          <ul className='flex items-center justify-between space-x-4'>
            <li>
              <ColorModeToggle value={theme} onChange={setTheme} />
            </li>
            <li className='md:hidden'>
              <Menu as='div' className='relative inline-block text-left'>
                <div>
                  <Menu.Button
                    className={clsxm(
                      'inline-flex items-center rounded px-4 py-2 font-semibold',
                      'animate-shadow scale-100 transform-gpu transition duration-300 hover:scale-[1.03] active:scale-[0.97]',
                      'transition-all duration-200 hover:text-primary-300'
                    )}
                  >
                    <FiMenu className='text-2xl' />
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
                  <Menu.Items className='absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md bg-neutral-200 shadow-lg ring-1 ring-light ring-opacity-5 focus:outline-none dark:bg-neutral-800'>
                    <div className='px-1 py-1'>
                      {links.map(({ href, label }) => (
                        <Menu.Item key={label}>
                          {({ active }) => (
                            <UnstyledLink
                              href={href}
                              className={clsxm(
                                active
                                  ? 'bg-rose-500 text-white'
                                  : 'text-dark dark:text-gray-100',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors'
                              )}
                            >
                              {label}
                            </UnstyledLink>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
