import { useLayoutEffect, useState } from 'react';

export const useMediaQuery = (queries: string[]): boolean[] => {
  const [values, setValues] = useState<boolean[]>(Array(queries.length).fill(false));

  useLayoutEffect(() => {
    const mediaQueryLists = queries.map((query) => window.matchMedia(query));
    const getValues = () => mediaQueryLists.map((list) => list.matches);
    const handler = () => setValues(getValues);
    handler();

    mediaQueryLists.forEach((list) => list.addEventListener('change', handler));

    return () => mediaQueryLists.forEach((list) => list.removeEventListener('change', handler));
  }, []);

  return values;
};
