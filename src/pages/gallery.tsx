/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { withIronSessionSsr } from 'iron-session/next';
import { orderBy, throttle } from 'lodash';
import type { GetServerSideProps, NextPage } from 'next';
import queryString from 'query-string';
import {
  type ClipboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from 'react-icons/fa';
import { FiTrash, FiUpload } from 'react-icons/fi';
import { HiDotsHorizontal } from 'react-icons/hi';
import PhotoAlbum from 'react-photo-album';
import { Modal } from 'react-responsive-modal';
import { SEPARATORS, WithContext as ReactTags } from 'react-tag-input';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'react-use';
import useSWR from 'swr';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import { Badge } from '@/components/Badge';
import Button from '@/components/buttons/Button';
import XButton from '@/components/buttons/XButton';
import DragNDrop from '@/components/DragNDrop';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import clsxm from '@/lib/clsxm';
import { addMinutesToDate } from '@/lib/datetime';
import imageToDataUri from '@/lib/imageToDataUri';
import renameFile from '@/lib/renameFile';
import { TAGS_SUGGESTION } from '@/lib/tags';
import { uniqueByKey } from '@/lib/uniqueByKey';
import {
  CloudinaryAdminResponse,
  CloudinaryAdminTagsResponse,
} from '@/types/cloudinary';

const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

type ImageCacheType = {
  images: CloudinaryAdminResponse;
  expiredAt: Date;
};

type TagsCacheType = {
  tags: CloudinaryAdminTagsResponse;
  expiredAt: Date;
};

type UploadTag = {
  id: string;
  className: string;
  [key: string]: string;
};

const GalleryPage: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [openTagModal, setOpenTagModal] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const onOpenTagModal = () => setOpenTagModal(true);
  const onCloseTagModal = () => setOpenTagModal(false);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [editTags, setEditTags] = useState<UploadTag[]>([]);
  const [editTagsId, setEditTagsId] = useState<string>();
  const [index, setIndex] = useState(-1);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressingProgress, setCompressingProgress] = useState(0);
  const [direction, setDirection] = useLocalStorage<'asc' | 'desc'>('asc');
  const [size, setSize] = useState(20);
  const [nextCursor, setNextCursor] = useState<string>();
  const [cacheValue, setCacheValue, removeCache] =
    useLocalStorage<ImageCacheType>('images-cache', undefined);
  const [selectedTags, setSelectedTags] = useState('All');

  const [uploadTags, setUploadTags] = useState<UploadTag[]>([]);

  const [tagsCacheValue, setTagsCacheValue, removeTagsCache] =
    useLocalStorage<TagsCacheType>('tags-cache', undefined);

  const {
    data: result,
    mutate,
    isValidating,
  } = useSWR<{
    ok: boolean;
    data: {
      images: CloudinaryAdminResponse;
      tags: CloudinaryAdminTagsResponse;
    };
  }>(
    typeof localStorage !== 'undefined' && !cacheValue
      ? queryString.stringifyUrl({
          url: '/api/gallery',
          query: { next_cursor: nextCursor, direction, tags: selectedTags },
        })
      : null,
  );

  const images = useMemo(() => result?.data?.images, [result]);
  const tags = useMemo(() => result?.data?.tags, [result]);

  const data = useMemo(
    () => cacheValue?.images || images,
    [cacheValue, images],
  );

  useEffect(() => {
    setNextCursor(data?.next_cursor);
  }, [data]);

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
            options,
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
    [],
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
    [handleSetImage],
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

  const onSubmitEdit = async () => {
    if (!editTagsId) {
      return;
    }

    try {
      const payload = {
        tags: editTags.map((t) => t.text).filter(Boolean),
      };

      await toast.promise(
        axios.post(`/api/gallery/${editTagsId.split('/').pop()}`, payload),
        {
          pending: {
            render: () => {
              return 'Loading';
            },
          },
          success: {
            render: () => {
              removeTagsCache();
              removeCache();
              mutate();
              return 'Updated successfully';
            },
          },
          error: {
            render: () => {
              return 'Failed to update!';
            },
          },
        },
      );
    } finally {
      setEditTagsId(undefined);
    }
  };

  const onSubmit = async () => {
    if (!selectedFile) {
      return toast.error('Please include an image!');
    }

    const fileToBeSent = renameFile(
      selectedFile,
      `${selectedFile.name.split('.').slice(0, -1).join('.')}-${Date.now()}.${
        selectedFile.name.split('.').splice(-1)[0]
      }`,
    );

    const payload = {
      image: imageToDataUri(
        await fileToBeSent.arrayBuffer(),
        fileToBeSent.type,
      ),
      name: fileToBeSent.name,
      tags: uploadTags.map((t) => t.text).filter(Boolean),
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
          removeCache();
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

  useEffect(() => {
    if (cacheValue) {
      if (cacheValue.expiredAt > new Date()) {
        removeCache();
      }
    }
    if (tagsCacheValue) {
      if (tagsCacheValue.expiredAt > new Date()) {
        removeTagsCache();
      }
    }
  }, [cacheValue, removeCache, removeTagsCache, tagsCacheValue]);

  useEffect(() => {
    if (images) {
      setCacheValue({ images, expiredAt: addMinutesToDate(new Date(), 15) });
    }
    if (tags) {
      setTagsCacheValue({ tags, expiredAt: addMinutesToDate(new Date(), 15) });
    }
  }, [images, setCacheValue, setTagsCacheValue, tags]);

  const imgSource = useMemo(
    () =>
      orderBy(
        (cacheValue?.images || images)?.resources.map((v) => ({
          src: v.secure_url,
          width: v.width,
          height: v.height,
          createdAt: v.created_at,
          publicId: v.public_id,
          tags: v.tags,
        })),
        'createdAt',
        direction,
      ).slice(0, size) || [],
    [images, cacheValue, direction, size],
  );

  const allTags = useMemo(
    () => tagsCacheValue?.tags || tags,
    [tags, tagsCacheValue?.tags],
  );

  const handleDelete = (index: number) => {
    setUploadTags((tags) => tags.filter((_, i) => i !== index));
  };

  const onTagUpdate = (index: number, newTag: UploadTag) => {
    const updatedTags = [...uploadTags];
    updatedTags.splice(index, 1, newTag);
    setUploadTags(updatedTags);
  };

  const handleAddition = (tag: UploadTag) => {
    setUploadTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const handleDrag = (tag: UploadTag, currPos: number, newPos: number) => {
    const newTags = uploadTags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setUploadTags(newTags);
  };

  const handleDeleteEditTag = (index: number) => {
    setEditTags((tags) => tags.filter((_, i) => i !== index));
  };

  const onTagUpdateEditTag = (index: number, newTag: UploadTag) => {
    const updatedTags = [...uploadTags];
    updatedTags.splice(index, 1, newTag);
    setEditTags(updatedTags);
  };

  const handleAdditionEditTag = (tag: UploadTag) => {
    setEditTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const handleDragEditTag = (
    tag: UploadTag,
    currPos: number,
    newPos: number,
  ) => {
    const newTags = editTags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setEditTags(newTags);
  };

  const onClearAllEditTag = () => {
    setEditTags([]);
  };

  const handleTagClick = (index: number) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const onClearAll = () => {
    setUploadTags([]);
  };

  // useEffect(
  //   () =>
  //     setUploadTags((t) =>
  //       uniqueByKey(
  //         [
  //           ...new Set([
  //             ...(allTags?.tags.map((tag) => ({
  //               id: tag,
  //               text: tag,
  //               className: tag,
  //             })) ?? []),
  //             ...t,
  //           ]),
  //         ],
  //         'id',
  //       ),
  //     ),
  //   [allTags],
  // );

  const suggestions = useMemo(
    () =>
      uniqueByKey(
        [
          ...TAGS_SUGGESTION.map((t) => ({ id: t, text: t, className: t })),
          ...(allTags?.tags.map((t) => ({ id: t, text: t, className: t })) ??
            []),
        ],
        'id',
      ),
    [allTags?.tags],
  );

  return (
    <Layout trueFooter skipToContent={false}>
      <Seo templateTitle='Gallery' />
      <main className='px-8'>
        <div className='mb-4 flex flex-col items-center justify-between md:flex-row'>
          <h1 className='mb-4 text-4xl text-primary-300'>
            Memori kita bersama 💕
          </h1>
          <div className='flex items-center gap-12'>
            <Button
              className='flex space-x-2'
              onClick={() => {
                setDirection(direction === 'asc' ? 'desc' : 'asc');
              }}
            >
              {direction === 'asc' ? (
                <FaSortAmountDownAlt />
              ) : (
                <FaSortAmountUpAlt />
              )}
              <span>Urutkan</span>
            </Button>
            <Button
              className='space-x-2'
              onClick={() => {
                removeCache();
              }}
            >
              Reset cache
            </Button>
          </div>
        </div>
        <div className='flex gap-x-4'>
          {['All', ...(allTags?.tags ?? [])].map((tag, i) => (
            <Badge
              variant={selectedTags === tag ? 'default' : 'secondary'}
              className='cursor-pointer'
              key={tag + i}
              onClick={throttle(() => {
                if (isValidating) {
                  return;
                }
                setSelectedTags(tag);
                removeCache();
              }, 500)}
            >
              {tag}
            </Badge>
          ))}
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
                  <ReactTags
                    separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
                    tags={uploadTags}
                    suggestions={suggestions}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    handleTagClick={handleTagClick}
                    onTagUpdate={onTagUpdate}
                    inputFieldPosition='bottom'
                    editable
                    clearAll
                    onClearAll={onClearAll}
                    maxTags={5}
                    placeholder='Press enter or comma'
                  />
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
                        'disabled:bg-green-300 disabled:hover:bg-green-300 disabled:hover:text-black',
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
            <Modal
              open={openTagModal}
              onClose={onCloseTagModal}
              center
              classNames={{ modal: 'rounded-xl bg:light dark:bg-dark w-1/2' }}
              closeIcon={<XButton />}
            >
              <div className='flex justify-center items-center flex-col gap-8'>
                <h1>Edit tags</h1>
                <ReactTags
                  separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
                  tags={editTags}
                  suggestions={suggestions}
                  handleDelete={handleDeleteEditTag}
                  handleAddition={handleAdditionEditTag}
                  handleDrag={handleDragEditTag}
                  handleTagClick={handleTagClick}
                  onTagUpdate={onTagUpdateEditTag}
                  inputFieldPosition='bottom'
                  editable
                  clearAll
                  onClearAll={onClearAllEditTag}
                  maxTags={5}
                  placeholder='Press enter or comma'
                />
                <Button variant='primary' onClick={onSubmitEdit}>
                  Submit
                </Button>
              </div>
            </Modal>
            <PhotoAlbum
              layout='rows'
              photos={imgSource}
              renderPhoto={({
                photo: { tags, publicId },
                wrapperStyle,
                renderDefaultPhoto,
              }) => (
                <div
                  className={`relative group`}
                  key={publicId}
                  style={wrapperStyle}
                >
                  {renderDefaultPhoto({ wrapped: true })}
                  <button
                    className={`absolute rounded-full top-1 right-1 md:top-2 md:right-2 bg-slate-500 bg-opacity-40 hover:bg-opacity-90 group-hover:block md:hidden block transition-all`}
                    onClick={() => {
                      setEditTags(
                        tags?.map((t) => ({
                          id: t,
                          className: '',
                          text: t,
                        })) ?? [],
                      );
                      setEditTagsId(publicId);
                      onOpenTagModal();
                    }}
                  >
                    <HiDotsHorizontal size={20} className='md:hidden block' />
                    <HiDotsHorizontal size={24} className='hidden md:block' />
                  </button>
                </div>
              )}
              onClick={({ index }) => {
                setIndex(index);
              }}
            />
            <Lightbox
              slides={imgSource}
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
              plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            />
          </div>
          <div className='my-8 flex justify-center'>
            {data?.resources.length && size < data?.resources.length && (
              <Button variant='outline' onClick={() => setSize((s) => s + 20)}>
                Load more
              </Button>
            )}
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
  COOKIE_OPTIONS,
);

export default GalleryPage;
