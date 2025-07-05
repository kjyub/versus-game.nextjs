'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';

export const useDetectClose = <T extends HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const ref = useRef<T | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const pageClickEvent = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(!isOpen);
      }
    };

    if (isOpen) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [isOpen, ref]);

  return [ref, isOpen, setIsOpen];
};
