'use client';

import CError from '@/components/commons/errors/Error';
import { useEffect } from 'react';

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <CError message="게임 데이터를 불러오는데 실패했습니다." redirectUrl="/" />
    </div>
  );
}
