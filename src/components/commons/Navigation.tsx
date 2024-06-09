"use client"

import React, { Dispatch, SetStateAction, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as MainStyles from "@/styles/MainStyles"
import LoginModal from "../users/LoginModal"
import { useDetectClose } from "@/hooks/useDetectClose"

export interface INavigation {}
const Navigation = ({}: INavigation) => {
    const [loginRef, isLoginShow, setLoginShow] = useDetectClose()

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        if (isCloseByBackground) {
            setIsOpen(false)
        }
    }

    const handleStopPropagation = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
    }

    return (
        // <></>
        <MainStyles.NavBox>
            <span className="title">Versus Game</span>
            <MainStyles.LoginButtonContainer ref={loginRef}>
                <MainStyles.LoginButton
                    onClick={() => {
                        setLoginShow(!isLoginShow)
                    }}
                >
                    로그인
                </MainStyles.LoginButton>
                <MainStyles.LoginLayout $is_show={isLoginShow}>
                    <LoginModal isModalShow={isLoginShow} />
                </MainStyles.LoginLayout>
            </MainStyles.LoginButtonContainer>
        </MainStyles.NavBox>
    )
}

export default Navigation
