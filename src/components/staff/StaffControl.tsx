'use client';
import * as SS from '@/styles/StaffStyles';
import ApiUtils from '@/utils/ApiUtils';

const PAGE_SIZE = 100;

export default function StaffControl() {
  const handleCron = async () => {
    const { result, data } = await ApiUtils.request('/api/cron/', 'GET', {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`,
      },
    });

    if (result) {
      alert('실행되었습니다.');
    } else {
      alert('요청 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col w-full h-48 p-4 divide-y divide-stone-400">
      <SS.GameStateButton
        className="p-4"
        onClick={() => {
          handleCron();
        }}
      >
        크론 실행
      </SS.GameStateButton>
    </div>
  );
}
