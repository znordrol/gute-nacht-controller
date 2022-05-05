import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import ColorModeToggle from '@/components/ColorModeToggle';
import UnstyledLink from '@/components/links/UnstyledLink';

const links = [
  { href: '/ttt', label: 'Tic Tac Toe' },
  { href: '/countdown', label: 'Countdown' },
  { href: '/particles', label: 'Particles' },
];

const Header = (): JSX.Element => {
  const { theme, setTheme } = useTheme();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className='bg-gray-300 dark:bg-neutral-700'>
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
              {loaded && <ColorModeToggle value={theme} onChange={setTheme} />}
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
