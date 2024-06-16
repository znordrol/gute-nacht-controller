import { HiX } from 'react-icons/hi';

import clsxm from '@/lib/clsxm';

const XButton = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      type='button'
      className={clsxm(
        'rounded-full p-1 ring-red-400 transition hover:bg-red-500 focus:outline-none focus-visible:ring group-hover:block',
        className,
      )}
      {...rest}
    >
      {children}
      <HiX />
    </button>
  );
};

export default XButton;
