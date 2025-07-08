import * as MS from '@/styles/MainStyles';
import { CookieConsts } from '@/types/ApiTypes';
import { UserRole } from '@/types/UserTypes';
import type User from '@/types/user/User';
import Link from 'next/link';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { createPortal } from 'react-dom';

// backdrop blur를 위해 portal 처리
const Layout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.top, left: rect.left });
    }
  }, [])

  return (
    <div ref={ref}>
      {createPortal(
        <div className="fixed z-110" style={{ top: position.top, left: position.left }}>
          {children}
        </div>,
        document.body
      )}
    </div>
  );
};

export interface IMobileNav {
  isModalShow: boolean;
  setModalShow: Dispatch<SetStateAction<boolean>>;
  user: User;
}
const MobileNav = ({ isModalShow, setModalShow, user }: IMobileNav) => {
  return (
    <Layout>
      <MS.MobileNavContainer $is_show={isModalShow}>
        <MS.MobileNavList onClick={() => setModalShow(false)}>
          <Link
            href={'/'}
            onClick={() => {
              sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
            }}
          >
            <MS.MobileNavButton>
              <i className="fa-solid fa-gamepad"></i>
              게임 찾기
            </MS.MobileNavButton>
          </Link>
          <Link
            href={'/game/add'}
            onClick={() => {
              sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
            }}
          >
            <MS.MobileNavButton>
              <i className="fa-solid fa-plus"></i>
              게임 만들기
            </MS.MobileNavButton>
          </Link>
          {user.userRole === UserRole.STAFF && (
            <Link href={'/csstaff'}>
              <MS.MobileNavButton>
                <i className="fa-solid fa-hammer"></i>
                관리
              </MS.MobileNavButton>
            </Link>
          )}
        </MS.MobileNavList>
      </MS.MobileNavContainer>
    </Layout>
  );
};
export default MobileNav;
