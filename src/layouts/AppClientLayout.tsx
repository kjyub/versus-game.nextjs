'use client';

import ModalContainer from '@/components/ModalContainer';
import SystemMessagePopup from '@/components/commons/SystemMessagePopup';
import ToastPopup from '@/components/commons/ToastPopup';
import { CookieConsts } from '@/types/ApiTypes';
import ApiUtils from '@/utils/ApiUtils';
import BrowserUtils from '@/utils/BrowserUtils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppClientLayout({ children }: { children?: React.ReactNode }) {
  const [isInAppBrowser, setIsInAppBrowser] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    requestGuestId();

    // 게임 리스트 페이지로 되돌아 올 시 저장하는 데이터 삭제
    sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
  }, []);

  useEffect(() => {
    if (pathname.includes('embed')) {
      return;
    }

    // 인앱 브라우저 인식 후 외부 브라우저로 이동
    const isRedirect = BrowserUtils.goExternalBrowser();
    setIsInAppBrowser(isRedirect);
  }, [pathname]);

  const requestGuestId = async () => {
    const response = await ApiUtils.request('/api/users/guest', 'POST');
  };

  return (
    <>
      <ModalContainer isOpen={isInAppBrowser} setIsOpen={() => {}}>
        <div className="flex flex-col rounded-xl bg-white/70 backdrop-blur" style={{ padding: '1.5rem' }}>
          <span className="text-lg font-semibold text-stone-800">추즈밍은 외부 웹브라우저에서 사용 가능합니다</span>

          <button
            className="p-2 mt-4 rounded-xl bg-rose-500 text-white"
            type="button"
            onClick={() => {
              BrowserUtils.redirectToExternalBrowser();
            }}
          >
            웹브라우저 열기
          </button>
        </div>
      </ModalContainer>

      <ToastPopup />
      <SystemMessagePopup />

      {children}
    </>
  );
}
