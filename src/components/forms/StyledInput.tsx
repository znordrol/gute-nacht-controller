import * as React from 'react';

import clsxm from '@/lib/clsxm';

const StyledInput = ({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'input'>) => {
  return (
    <input
      className={clsxm(
        'w-full rounded-md dark:bg-dark',
        'border border-gray-300 dark:border-gray-500',
        'transition-all duration-200 focus:border-primary-300 focus:outline-none focus:ring-0 dark:focus:border-primary-300',
        className
      )}
      {...rest}
    />
  );
};

export default StyledInput;
