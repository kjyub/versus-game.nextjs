import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as MS from "@/styles/MainStyles"
import Link from "next/link"
import User from "@/types/user/User"
import { UserRole } from "@/types/UserTypes"
import StyleUtils from "@/utils/StyleUtils"
import { CookieConsts } from "@/types/ApiTypes"

export interface IMobileNav {
    isModalShow: boolean
    setModalShow: Dispatch<SetStateAction<boolean>>
    user: User
}
const MobileNav = ({ isModalShow, setModalShow, user }: IMobileNav) => {
    const handleMobileNav = () => {
        setModalShow(false)
        StyleUtils.rollbackScreen()
    }

    return (
        <MS.MobileNavContainer $is_staff={user.userRole === UserRole.STAFF} style={{transition: "1s filter linear"}}>
            <MS.MobileNavList onClick={()=>{handleMobileNav()}}>
                <Link href={"/"} onClick={() => {sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION)}}>
                    <MS.MobileNavButton>
                        <i className="fa-solid fa-gamepad"></i>
                        게임 찾기
                    </MS.MobileNavButton>
                </Link>
                <Link href={"/game/add"} onClick={() => {sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION)}}>
                    <MS.MobileNavButton>
                        <i className="fa-solid fa-plus"></i>
                        게임 만들기
                    </MS.MobileNavButton>
                </Link>
                {user.userRole === UserRole.STAFF && (
                    <Link href={"/csstaff"}>
                        <MS.MobileNavButton>
                            <i className="fa-solid fa-hammer"></i>
                            관리
                        </MS.MobileNavButton>
                    </Link>
                )}
            </MS.MobileNavList>
        </MS.MobileNavContainer>
    )
}
export default MobileNav
