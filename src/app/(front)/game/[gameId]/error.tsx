'use client';

import CError from '@/components/commons/errors/Error';

export default function ErrorPage() {
  return (
    <div>
      <CError message="게임 데이터를 불러오는데 실패했습니다." redirectUrl="/" />
    </div>
  );
}
