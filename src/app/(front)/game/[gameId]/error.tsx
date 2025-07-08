'use client';

import CError from '@/components/commons/errors/Error';
import { useEffect } from 'react';

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <CError message={String(error)} redirectUrl="/" />
    </div>
  );
}
