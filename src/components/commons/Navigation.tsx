'use client';

import { useDetectClose } from '@/hooks/useDetectClose';
import { useUser } from '@/hooks/useUser';
import useToastMessageStore from '@/stores/zustands/useToastMessageStore';
import * as MS from '@/styles/MainStyles';
import { CookieConsts } from '@/types/ApiTypes';
import { UserRole } from '@/types/UserTypes';
import Link from 'next/link';
import type React from 'react';
import LoginModal from '../users/LoginModal';
import MyInfoModal from '../users/MyInfoModal';
import MobileNav from './MobileNav';

const Navigation = () => {
  const user = useUser();

  const [userRef, isUserShow, setUserShow] = useDetectClose<HTMLDivElement>();
  const [loginRef, isLoginShow, setLoginShow] = useDetectClose<HTMLDivElement>();
  const [mobileNavRef, isMobileNavShow, setMobileNavShow] = useDetectClose<HTMLDivElement>();

  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  const handleUserInfo = async () => {
    if (isUserShow) {
      setUserShow(false);
    } else {
      setUserShow(true);
    }
  };

  const handleGameAdd = (e: React.MouseEvent<HTMLElement>) => {
    if (!user.isAuth) {
      e.preventDefault();
      createToastMessage('로그인 후 이용가능합니다.');
      return;
    }
  };

  return (
    <>
      {/* 마진용 */}
      <div className="shrink-0 w-full max-md:h-12 md:h-14"></div>
      <MS.NavBox>
        {/* 내비게이션 메뉴 (PC) */}
        <MS.NavButtonList className="max-md:hidden md:flex">
          <MS.NavButtonContainer $is_show={true}>
            <Link
              href={'/game/add'}
              onClick={() => {
                sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
              }}
            >
              <MS.NavButton onClick={handleGameAdd}>
                <i className="fa-solid fa-gamepad mr-2"></i>
                게임 만들기
              </MS.NavButton>
            </Link>
          </MS.NavButtonContainer>
          {user.userRole === UserRole.STAFF && (
            <MS.NavButtonContainer $is_show={true} className="max-md:left-40 md:left-40">
              <Link href={'/csstaff'}>
                <MS.NavButton>
                  <i className="fa-solid fa-hammer mr-2"></i>
                  관리
                </MS.NavButton>
              </Link>
            </MS.NavButtonContainer>
          )}
        </MS.NavButtonList>

        {/* 내비게이션 메뉴 (모바일) */}
        <MS.NavButtonList className="max-md:flex md:hidden">
          <MS.NavButtonContainer $is_show={true} ref={mobileNavRef}>
            <MS.NavMobileMenuButton
              onClick={() => {
                setMobileNavShow(!isMobileNavShow);
              }}
            >
              <i className="fa-solid fa-bars text-lg mr-2 mt-[2px]"></i>
              메뉴
            </MS.NavMobileMenuButton>

            <MobileNav isModalShow={isMobileNavShow} setModalShow={setMobileNavShow} user={user} />
          </MS.NavButtonContainer>
        </MS.NavButtonList>

        {/* 내비게이션 로고 */}
        <MS.NavTitle>
          <Link
            href={'/'}
            className="title"
            onClick={() => {
              sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
            }}
          >
            <span>VS 게임</span>
          </Link>
        </MS.NavTitle>

        {/* 내비게이션 회원 (로그인 상태) */}
        <div className="ml-auto z-10">
          <MS.LoginButtonContainer ref={userRef} $is_show={user.isAuth}>
            <MS.LoginButton
              onClick={() => {
                handleUserInfo();
              }}
            >
              회원 정보
            </MS.LoginButton>
            <MS.LoginLayout $is_show={isUserShow}>
              <MyInfoModal isModalShow={isUserShow} />
            </MS.LoginLayout>
          </MS.LoginButtonContainer>

          {/* 내비게이션 회원 (로그인 안된 상태) */}
          <MS.LoginButtonContainer ref={loginRef} $is_show={!user.isAuth}>
            <MS.LoginButton
              onClick={() => {
                setLoginShow(!isLoginShow);
              }}
            >
              로그인
            </MS.LoginButton>
            <MS.LoginLayout $is_show={isLoginShow}>
              <LoginModal isModalShow={isLoginShow} setModalShow={setLoginShow} />
            </MS.LoginLayout>
          </MS.LoginButtonContainer>
        </div>
      </MS.NavBox>
    </>
  );
};

export default Navigation;
