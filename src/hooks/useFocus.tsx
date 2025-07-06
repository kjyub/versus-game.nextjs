import { useEffect, useRef, useState } from 'react';

export const useFocus = <T extends HTMLElement>() => {
  const [isFocus, setFocus] = useState<boolean>(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleFocus = () => {
      setFocus(true);
    };
    const handleBlur = () => {
      setFocus(false);
    };
    ref.current?.addEventListener('focus', handleFocus);
    ref.current?.addEventListener('blur', handleBlur);

    return () => {
      ref.current?.removeEventListener('focus', handleFocus);
      ref.current?.removeEventListener('blur', handleBlur);
    };
  }, [ref]);

  return { isFocus, setFocus, ref };
};
