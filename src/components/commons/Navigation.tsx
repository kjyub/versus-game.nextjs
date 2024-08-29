"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as MainStyles from "@/styles/MainStyles"
import LoginModal from "../users/LoginModal"
import { useDetectClose } from "@/hooks/useDetectClose"
import { signOut, useSession } from "next-auth/react"
import ApiUtils from "@/utils/ApiUtils"
import MyInfoModal from "../users/MyInfoModal"
import User from "@/types/user/User"
import Link from "next/link"
import { UserRole } from "@/types/UserTypes"
import MobileNav from "./MobileNav"

export interface INavigation {}
const Navigation = ({}: INavigation) => {
    const session = useSession()

    const [user, setUser] = useState<User>(new User())

    const [userRef, isUserShow, setUserShow] = useDetectClose()
    const [loginRef, isLoginShow, setLoginShow] = useDetectClose()
    const [mobileNavRef, isMobileNavShow, setMobileNavShow] = useDetectClose()

    useEffect(() => {
        if (session.status === "authenticated") {
            getUserInfo()
        }
    }, [session])

    const getUserInfo = async () => {
        try {
            if (CommonUtils.isStringNullOrEmpty(session.data?.user._id)) {
                return
            } 
        } catch {
            return
        }
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/users/user_info/${session.data?.user._id}`,
            "GET",
        )

        if (bResult) {
            const user = new User()
            user.parseResponse(response)
            setUser(user)
        } else {
            alert(response)
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        userCheck()
    }

    const handleStopPropagation = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
    }

    const handleUserInfo = async () => {
        if (isUserShow) {
            setUserShow(false)
        } else {
            await getUserInfo()
            setUserShow(true)
        }
    }

    const userCheck = async () => {
        await ApiUtils.request("/api/users/user_check", "POST")
    }

    const handleGameAdd = (e) => {
        if (session.status !== "authenticated") {
            e.preventDefault()
            alert("로그인 후 이용가능합니다.")
            return
        }
    }

    return (
        // <></>
        <MainStyles.NavBox>
            {/* 내비게이션 메뉴 (PC) */}
            <MainStyles.NavButtonList className="max-md:hidden md:flex">
                <MainStyles.ItemAddButtonContainer $is_show={true}>
                    <Link href={"/game/add"}>
                        <MainStyles.NavButton
                            onClick={handleGameAdd}
                        >
                            <i className="fa-solid fa-gamepad mr-2"></i>
                            게임 만들기
                        </MainStyles.NavButton>
                    </Link>
                </MainStyles.ItemAddButtonContainer>
                {user.userRole === UserRole.STAFF && (
                    <MainStyles.ItemAddButtonContainer $is_show={true} className="max-md:left-40 md:left-40">
                        <Link href={"/csstaff"}>
                            <MainStyles.NavButton>
                                <i className="fa-solid fa-hammer mr-2"></i>
                                관리
                            </MainStyles.NavButton>
                        </Link>
                    </MainStyles.ItemAddButtonContainer>
                )}
            </MainStyles.NavButtonList>
            {/* 내비게이션 메뉴 (모바일) */}
            <MainStyles.NavButtonList className="max-md:flex md:hidden">
                <MainStyles.ItemAddButtonContainer 
                    $is_show={true}
                    ref={mobileNavRef}
                >
                    <MainStyles.NavMobileMenuButton
                        onClick={() => {
                            setMobileNavShow(!isMobileNavShow)
                        }}
                    >
                        <i className="fa-solid fa-bars text-lg mr-2 mt-[2px]"></i>
                        메뉴
                    </MainStyles.NavMobileMenuButton>

                    <MainStyles.MobileNavLayout $is_show={isMobileNavShow} >
                        {isMobileNavShow && (
                            <MobileNav
                                isModalShow={isMobileNavShow}
                                setModalShow={setMobileNavShow}
                                user={user}
                            />
                        )}
                    </MainStyles.MobileNavLayout>
                </MainStyles.ItemAddButtonContainer>
            </MainStyles.NavButtonList>

            {/* 내비게이션 로고 */}
            <Link href={"/"} className="title">
                <span>Versus Game</span>
            </Link>
            
            {/* 내비게이션 회원 (로그인 상태) */}
            <MainStyles.LoginButtonContainer
                ref={userRef}
                $is_show={session.status === "authenticated"}
            >
                {/* <MainStyles.LoginButton
                    onClick={() => {
                        handleClick()
                    }}
                >
                    회원 체크
                </MainStyles.LoginButton> */}
                <MainStyles.LoginButton
                    onClick={() => {
                        handleUserInfo()
                    }}
                >
                    회원 정보
                </MainStyles.LoginButton>
                <MainStyles.LoginLayout $is_show={isUserShow}>
                    {isUserShow && (
                        <MyInfoModal
                            isModalShow={isUserShow}
                            user={user}
                        />
                    )}
                </MainStyles.LoginLayout>
            </MainStyles.LoginButtonContainer>

            {/* 내비게이션 회원 (로그인 안된 상태) */}
            <MainStyles.LoginButtonContainer
                ref={loginRef}
                $is_show={session.status !== "authenticated"}
            >
                <MainStyles.LoginButton
                    onClick={() => {
                        setLoginShow(!isLoginShow)
                    }}
                >
                    로그인
                </MainStyles.LoginButton>
                <MainStyles.LoginLayout $is_show={isLoginShow}>
                    {isLoginShow && (
                        <LoginModal
                            isModalShow={isLoginShow}
                            setModalShow={setLoginShow}
                        />
                    )}
                </MainStyles.LoginLayout>
            </MainStyles.LoginButtonContainer>
        </MainStyles.NavBox>
    )
}

export default Navigation
