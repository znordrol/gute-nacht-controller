/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { type ClipboardEvent, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiTrash, FiUpload } from 'react-icons/fi';
import PhotoAlbum from 'react-photo-album';
import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import Button from '@/components/buttons/Button';
import XButton from '@/components/buttons/XButton';
import DragNDrop from '@/components/DragNDrop';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import clsxm from '@/lib/clsxm';
import imageToDataUri from '@/lib/imageToDataUri';
import renameFile from '@/lib/renameFile';
import { CloudinaryAdminResponse } from '@/types/cloudinary';

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
  const [index, setIndex] = useState(-1);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressingProgress, setCompressingProgress] = useState(0);

  const { data: images, mutate } = useSWR<{
    ok: boolean;
    data: CloudinaryAdminResponse;
  }>('/api/gallery');

  const onUpload = (files?: FileList | File[] | null) => {
    setSelectedFile(files?.[0]);
  };

  const handleSetImage = useCallback(
    async (files?: FileList | File[] | null) => {
      const options = {
        maxSizeMB: 3,
        useWebWorker: true,
        onProgress: (progress: number) => {
          setCompressingProgress(progress);
        },
      };
      let totalSize = 0;
      const acceptedFiles = files ?? [];
      const compressedFiles: File[] = [];
      setIsCompressing(true);
      try {
        for (let i = 0, j = acceptedFiles.length; i < j; ++i) {
          const compressedFile = await imageCompression(
            acceptedFiles[i],
            options
          );
          if (compressedFile.size > 4000000) {
            toast.error('Image is too big, maximum size is 4mb');
            return;
          }
          compressedFiles.push(compressedFile);
          totalSize += compressedFile.size;
        }
      } catch {
        toast.error('Error compressing image');
      } finally {
        setIsCompressing(false);
      }
      if (totalSize > 4000000) {
        toast.error('Total image size must not exceed 4mb');
        return;
      }
      onUpload(compressedFiles);
    },
    []
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with the files
      if (!SUPPORTED_IMAGE_TYPES.includes(acceptedFiles[0].type)) {
        setSelectedFile(undefined);
        toast.error('File must be an image (jpeg, png, gif, webp)');
        return;
      }
      handleSetImage(acceptedFiles);
    },
    [handleSetImage]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    e.preventDefault();
    if (
      e?.currentTarget?.files?.[0]?.type &&
      !SUPPORTED_IMAGE_TYPES.includes(e.currentTarget.files[0].type)
    ) {
      e.target.value = '';
      setSelectedFile(undefined);
      toast.error('File must be an image (jpeg, png, gif, webp)');
      return;
    }
    handleSetImage(e?.currentTarget?.files);
  };

  const handlePaste = async (e: ClipboardEvent<HTMLInputElement>) => {
    if (
      e?.clipboardData?.files?.[0]?.type &&
      !SUPPORTED_IMAGE_TYPES.includes(e.clipboardData.files[0].type)
    ) {
      setSelectedFile(undefined);
      toast.error('File must be an image (jpeg, png, gif, webp)');
      return;
    }
    handleSetImage(e?.clipboardData?.files);
  };

  const onSubmit = async () => {
    if (!selectedFile) {
      return toast.error('Please include an image!');
    }

    const fileToBeSent = renameFile(
      selectedFile,
      `${selectedFile.name.split('.').slice(0, -1).join('.')}-${Date.now()}.${
        selectedFile.name.split('.').splice(-1)[0]
      }`
    );

    const payload = {
      image: imageToDataUri(
        await fileToBeSent.arrayBuffer(),
        fileToBeSent.type
      ),
      name: fileToBeSent.name,
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
          mutate();
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
      <main className='px-8'>
        <div className=''>
          <h1 className='mb-4 text-4xl text-primary-300'>
            Memori kita bersama 💕
          </h1>
        </div>
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
            <div className='pt-8' onPaste={handlePaste}>
              {!preview ? (
                <DragNDrop
                  onChange={onFileChange}
                  rootProps={getRootProps()}
                  inputProps={getInputProps()}
                >
                  <FiUpload className='mr-4' />
                  {isCompressing
                    ? `Compressing... ${compressingProgress}%`
                    : selectedFile?.name ?? 'Drop Image Here'}
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
        <section>
          <div>
            <PhotoAlbum
              layout='rows'
              photos={
                images?.data.resources.map((v) => ({
                  src: v.secure_url,
                  width: v.width,
                  height: v.height,
                })) || []
              }
              onClick={({ index }) => setIndex(index)}
            />
            <Lightbox
              slides={
                images?.data.resources.map((v) => ({
                  src: v.secure_url,
                  width: v.width,
                  height: v.height,
                })) || []
              }
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
              plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            />
          </div>
        </section>
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
