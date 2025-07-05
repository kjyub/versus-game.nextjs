'use client';

import { useEffect, useState } from 'react';

export default function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined' && typeof window.document !== 'undefined');
  }, []);

  return isClient;
}
