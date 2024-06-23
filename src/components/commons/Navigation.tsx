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

export interface INavigation {}
const Navigation = ({}: INavigation) => {
    const session = useSession()

    const [user, setUser] = useState<User>(new User())

    const [userRef, isUserShow, setUserShow] = useDetectClose()
    const [loginRef, isLoginShow, setLoginShow] = useDetectClose()

    useEffect(() => {
        if (session.status === "authenticated") {
            const _user = new User()
            _user.parseResponse(session.data.user)
            setUser(_user)
        }
    }, [session])

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        userCheck()
    }

    const handleStopPropagation = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
    }

    const userCheck = async () => {
        await ApiUtils.request("/api/users/user_check", "POST")
    }

    return (
        // <></>
        <MainStyles.NavBox>
            <MainStyles.ItemAddButtonContainer ref={userRef} $is_show={true}>
                <Link href={"/game/add"}>
                    <MainStyles.NavButton
                        onClick={() => {
                            // setUserShow(!isUserShow)
                        }}
                    >
                        게임 추가
                    </MainStyles.NavButton>
                </Link>
            </MainStyles.ItemAddButtonContainer>
            <span className="title">Versus Game</span>
            <MainStyles.LoginButtonContainer
                ref={userRef}
                $is_show={session.status === "authenticated"}
            >
                <MainStyles.LoginButton
                    onClick={() => {
                        setUserShow(true)
                    }}
                >
                    회원 정보
                </MainStyles.LoginButton>
                <MainStyles.LoginLayout $is_show={isUserShow}>
                    {isUserShow && (
                        <MyInfoModal
                            isModalShow={isUserShow}
                            userId={user.id}
                        />
                    )}
                </MainStyles.LoginLayout>
            </MainStyles.LoginButtonContainer>
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
