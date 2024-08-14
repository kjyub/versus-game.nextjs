"use client"

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
    }, [])

    useEffect(() => {
        // 모바일 화면 스크롤이 깨지지 않게 유지용
        StyleUtils.rollbackScreen()
    }, [pathname])

    const requestGuestId = async () => {
        const response = await ApiUtils.request("/api/users/guest", "POST")
        const [bResult, statusCode, resultData] = response
        // alert(resultData["message"] ?? "없음", resultData)
    }

    return children
}
