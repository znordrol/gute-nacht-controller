export const imageToDataUri = (
  data: Buffer | string | ArrayBuffer,
  mediaType: string
) => {
  if (!data || !mediaType) {
    return null;
  }

  mediaType = /\//.test(mediaType) ? mediaType : 'image/' + mediaType;
  const dataBase64 = Buffer.isBuffer(data)
    ? data.toString('base64')
    : typeof data === 'string'
    ? Buffer.from(data).toString('base64')
    : Buffer.from(data).toString('base64');
  const dataImgBase64 = 'data:' + mediaType + ';base64,' + dataBase64;

  return dataImgBase64;
};

export default imageToDataUri;
