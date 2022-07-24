/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiTrash, FiUpload } from 'react-icons/fi';
import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';

import Button from '@/components/buttons/Button';
import XButton from '@/components/buttons/XButton';
import DragNDrop from '@/components/DragNDrop';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import clsxm from '@/lib/clsxm';
import imageToDataUri from '@/lib/imageToDataUri';

const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const GalleryPage: NextPage = () => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  const onUpload = (files?: FileList | File[] | null) => {
    setSelectedFile(files?.[0]);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    if (!SUPPORTED_IMAGE_TYPES.includes(acceptedFiles[0].type)) {
      setSelectedFile(undefined);
      toast.error('File must be an image (jpeg, png, gif, webp)');
      return;
    }
    onUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    e.preventDefault();
    console.log(e?.currentTarget?.files?.[0]?.type);
    if (
      e?.currentTarget?.files?.[0]?.type &&
      !SUPPORTED_IMAGE_TYPES.includes(e.currentTarget.files[0].type)
    ) {
      e.target.value = '';
      setSelectedFile(undefined);
      toast.error('File must be an image (jpeg, png, gif, webp)');
      return;
    }
    onUpload(e?.currentTarget?.files);
  };

  const onSubmit = async () => {
    if (!selectedFile) {
      return toast.error('Please include an image!');
    }
    const payload = {
      image: imageToDataUri(
        await selectedFile.arrayBuffer(),
        selectedFile.type
      ),
      name: selectedFile.name,
    };

    onCloseModal();
    await toast.promise(axios.post('/api/gallery', payload), {
      pending: {
        render: () => {
          return 'Loading';
        },
      },
      success: {
        render: () => {
          setSelectedFile(undefined);
          return 'Image uploaded successfully';
        },
      },
      error: {
        render: () => {
          return 'Failed to upload image!';
        },
      },
    });
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <Layout trueFooter skipToContent={false}>
      <Seo templateTitle='Gallery' />
      <main>
        <section className='flex items-center justify-center py-4'>
          <Button className='flex space-x-2' onClick={onOpenModal}>
            <FiUpload />
            <span>Upload</span>
          </Button>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            classNames={{ modal: 'rounded-xl bg:light dark:bg-dark' }}
            closeIcon={<XButton />}
          >
            <div className='pt-8'>
              {!preview ? (
                <DragNDrop
                  onChange={onFileChange}
                  rootProps={getRootProps()}
                  inputProps={getInputProps()}
                >
                  <FiUpload className='mr-4' />
                  {selectedFile?.name ?? 'Drop Image Here'}
                </DragNDrop>
              ) : (
                <div className='flex flex-col gap-y-8'>
                  <img src={preview} alt='preview' />
                  <div className='flex justify-around'>
                    <Button
                      className='flex gap-x-2 py-1'
                      onClick={() => {
                        URL.revokeObjectURL(preview);
                        setPreview(undefined);
                        setSelectedFile(undefined);
                      }}
                    >
                      <FiTrash /> <span>Hapus</span>
                    </Button>
                    <Button
                      className={clsxm(
                        'flex gap-x-2 py-1',
                        'bg-green-300 text-black',
                        'border border-green-500',
                        'hover:bg-green-500 hover:text-primary-50',
                        'active:bg-green-600',
                        'disabled:bg-green-300 disabled:hover:bg-green-300 disabled:hover:text-black'
                      )}
                      onClick={onSubmit}
                    >
                      <FiUpload /> <span>Upload</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        </section>
        <section></section>
      </main>
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

export default GalleryPage;
