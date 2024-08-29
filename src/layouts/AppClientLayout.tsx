"use client"

import { CookieConsts } from "@/types/ApiTypes"
import ApiUtils from "@/utils/ApiUtils"
import StyleUtils from "@/utils/StyleUtils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function AppClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    useEffect(() => {
        requestGuestId()

        // 게임 리스트 페이지로 되돌아 올 시 저장하는 데이터 삭제
        sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION)
    }, [])

    useEffect(() => {
        // 모바일 화면 스크롤이 깨지지 않게 유지용
        StyleUtils.rollbackScreen()
        StyleUtils.initScrollEvent()
    }, [pathname])

    const requestGuestId = async () => {
        const response = await ApiUtils.request("/api/users/guest", "POST")
        // const [bResult, statusCode, resultData] = response
        // // alert(resultData["message"] ?? "없음", resultData)
    }

    return children
}
