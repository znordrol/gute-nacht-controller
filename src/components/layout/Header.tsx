import Link from 'next/link';

import UnstyledLink from '@/components/links/UnstyledLink';

const links = [
  { href: '/ttt', label: 'Tic Tac Toe' },
  { href: '/countdown', label: 'Countdown' },
];

const Header = (): JSX.Element => {
  return (
    <nav className='bg-neutral-700'>
      <ul className='flex items-center justify-between px-8 py-4'>
        <li>
          <ul className='flex items-center justify-between space-x-8'>
            <li>
              <Link href='/'>
                <a className='font-bold text-white transition-all duration-200 hover:text-primary-300'>
                  Home
                </a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <ul className='flex items-center justify-between space-x-4'>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink
                  href={href}
                  className='text-white transition-all duration-200 hover:text-primary-300'
                >
                  {label}
                </UnstyledLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
