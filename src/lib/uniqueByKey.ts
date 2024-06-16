// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uniqueByKey = (array: any[] = [], key = '') => {
  if (!key) {
    return array;
  }

  return [
    ...new Map(array.filter(Boolean).map((item) => [item[key], item])).values(),
  ];
};
