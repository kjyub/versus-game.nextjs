import { useEffect, useRef, useState } from 'react';

export const useMouseHover = (): [React.MutableRefObject<HTMLElement | null>, boolean] => {
  const ref = useRef<HTMLElement | null>(null);

  const [showHover, setShowHover] = useState(false);

  const handleMouseOver = () => {
    setShowHover(true);
  };
  const handleMouseOut = () => {
    setShowHover(false);
  };

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [ref.current]);

  return [ref, showHover];
};
