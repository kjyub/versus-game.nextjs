"use client";

import { useDetectClose } from "@/hooks/useDetectClose";
import * as MS from "@/styles/MainStyles";
import { CookieConsts } from "@/types/ApiTypes";
import { UserRole } from "@/types/UserTypes";
import User from "@/types/user/User";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LoginModal from "../users/LoginModal";
import MyInfoModal from "../users/MyInfoModal";
import MobileNav from "./MobileNav";

export interface INavigation {}
const Navigation = ({}: INavigation) => {
  const session = useSession();

  const [user, setUser] = useState<User>(new User());

  const [userRef, isUserShow, setUserShow] = useDetectClose();
  const [loginRef, isLoginShow, setLoginShow] = useDetectClose();
  const [mobileNavRef, isMobileNavShow, setMobileNavShow] = useDetectClose();

  useEffect(() => {
    if (session.status === "authenticated") {
      getUserInfo();
    }
  }, [session]);

  const getUserInfo = async () => {
    try {
      if (CommonUtils.isStringNullOrEmpty(session.data?.user._id)) {
        return;
      }
    } catch {
      return;
    }
    const { result, data } = await ApiUtils.request(`/api/users/user_info/${session.data?.user._id}`, "GET");

    if (result) {
      const user = new User();
      user.parseResponse(data);
      setUser(user);
    } else {
      alert(data);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    userCheck();
  };

  const handleStopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleUserInfo = async () => {
    if (isUserShow) {
      setUserShow(false);
    } else {
      await getUserInfo();
      setUserShow(true);
    }
  };

  const userCheck = async () => {
    await ApiUtils.request("/api/users/user_check", "POST");
  };

  const handleGameAdd = (e) => {
    if (session.status !== "authenticated") {
      e.preventDefault();
      alert("로그인 후 이용가능합니다.");
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
              href={"/game/add"}
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
              <Link href={"/csstaff"}>
                <MS.NavButton>
                  <i className="fa-solid fa-hammer mr-2"></i>
                  관리
                </MS.NavButton>
              </Link>
            </MS.NavButtonContainer>
          )}
        </MS.NavButtonList>

        {/* 내비게이션 메뉴 (모바일) */}
        {/* <MS.NavButtonList className="max-md:flex md:hidden">
          <MS.NavButtonContainer $is_show={true} ref={mobileNavRef}>
            <MS.NavMobileMenuButton
              onClick={() => {
                setMobileNavShow(!isMobileNavShow);
              }}
            >
              <i className="fa-solid fa-bars text-lg mr-2 mt-[2px]"></i>
              메뉴
            </MS.NavMobileMenuButton>

            <MS.MobileNavLayout $is_show={isMobileNavShow}>
              {isMobileNavShow && <MobileNav isModalShow={isMobileNavShow} setModalShow={setMobileNavShow} user={user} />}
            </MS.MobileNavLayout>
          </MS.NavButtonContainer>
        </MS.NavButtonList> */}

        {/* 내비게이션 로고 */}
        <MS.NavTitle>
          <Link
            href={"/"}
            className="title"
            onClick={() => {
              sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
            }}
          >
            <span>VS 게임</span>
          </Link>
        </MS.NavTitle>

        {/* 내비게이션 회원 (로그인 상태) */}
        <div className="ml-auto">
          <MS.LoginButtonContainer ref={userRef} $is_show={session.status === "authenticated"}>
            <MS.LoginButton
              onClick={() => {
                handleUserInfo();
              }}
            >
              회원 정보
            </MS.LoginButton>
            <MS.LoginLayout $is_show={isUserShow}>
              {isUserShow && <MyInfoModal isModalShow={isUserShow} user={user} />}
            </MS.LoginLayout>
          </MS.LoginButtonContainer>

          {/* 내비게이션 회원 (로그인 안된 상태) */}
          <MS.LoginButtonContainer ref={loginRef} $is_show={session.status !== "authenticated"}>
            <MS.LoginButton
              onClick={() => {
                setLoginShow(!isLoginShow);
              }}
            >
              로그인
            </MS.LoginButton>
            <MS.LoginLayout $is_show={isLoginShow}>
              {isLoginShow && <LoginModal isModalShow={isLoginShow} setModalShow={setLoginShow} />}
            </MS.LoginLayout>
          </MS.LoginButtonContainer>
        </div>
      </MS.NavBox>
    </>
  );
};

export default Navigation;
