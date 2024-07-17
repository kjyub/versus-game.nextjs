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
            getUserInfo()
        }
    }, [session])

    const getUserInfo = async () => {
        if (CommonUtils.isStringNullOrEmpty(session.data?.user._id)) {
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
        await getUserInfo()
        setUserShow(true)
    }

    const userCheck = async () => {
        await ApiUtils.request("/api/users/user_check", "POST")
    }

    return (
        // <></>
        <MainStyles.NavBox>
            <MainStyles.ItemAddButtonContainer $is_show={true}>
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
            <Link href={"/"} className="title">
                <span>Versus Game</span>
            </Link>
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
