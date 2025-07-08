import * as MS from '@/styles/MainStyles';
import { CookieConsts } from '@/types/ApiTypes';
import { UserRole } from '@/types/UserTypes';
import type User from '@/types/user/User';
import useToastMessageStore from '@/stores/zustands/useToastMessageStore';
import Link from 'next/link';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { createPortal } from 'react-dom';

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<typeof func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// backdrop blur를 위해 portal 처리
const Layout = ({ isModalShow, children }: { isModalShow: boolean; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const updatePosition = debounce(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
        setPosition({ top: rect.top, left: rect.left });
      }
    }, 100);

    setIsClient(typeof window !== 'undefined');
    updatePosition();

    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <div ref={ref}>
      {isClient && createPortal(
        <div className={`fixed z-110 ${isModalShow ? 'pointer-events-auto' : 'pointer-events-none'}`} style={{ top: position.top, left: position.left }}>
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
  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  const handleGameAdd = (e: React.MouseEvent<HTMLElement>) => {
    if (!user.isAuth) {
      e.preventDefault();
      createToastMessage('로그인 후 이용가능합니다.');
      return;
    }
  };

  return (
    <Layout isModalShow={isModalShow}>
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
            <MS.MobileNavButton onClick={handleGameAdd}>
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
