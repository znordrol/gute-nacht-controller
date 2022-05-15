import Link from 'next/link';
import { useTheme } from 'next-themes';

import Accent from '@/components/Accent';
import ColorModeToggle from '@/components/ColorModeToggle';
import UnstyledLink from '@/components/links/UnstyledLink';
import PageProgress from '@/components/PageProgress';
import clsxm from '@/lib/clsxm';

const links = [
  { href: '/ttt', label: 'Tic Tac Toe' },
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
              <Link href='/'>
                <a className='font-bold transition-all duration-200 hover:text-primary-300'>
                  Home
                </a>
              </Link>
            </li>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
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
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
