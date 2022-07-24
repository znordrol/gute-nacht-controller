import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

import clsxm from '@/lib/clsxm';

export type DragNDropProps = {
  readonly className?: string;
  readonly rootProps: DropzoneRootProps;
  readonly inputProps: DropzoneInputProps;
} & React.ComponentPropsWithoutRef<'input'> &
  Pick<React.ComponentPropsWithRef<'div'>, 'ref'>;

const DragNDrop = ({
  children,
  className,
  ref,
  rootProps,
  inputProps,
  ...rest
}: DragNDropProps) => {
  return (
    <>
      <div
        ref={ref}
        {...rootProps}
        className={clsxm(
          'flex cursor-pointer rounded-lg border-2 border-primary-100 p-20 text-4xl',
          className
        )}
      >
        {children}
      </div>
      <input
        type='file'
        name='image'
        id='imageInput'
        className='hidden'
        {...rest}
        {...inputProps}
      />
    </>
  );
};

export default DragNDrop;
