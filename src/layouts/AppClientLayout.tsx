"use client"

import ApiUtils from "@/utils/ApiUtils"
import { useEffect, useState } from "react"

export default function AppClientLayout({
    children,
}: {
    children: React.ReactNode
}) {

    useEffect(() => {
        requestGuestId()
    }, [])

    const requestGuestId = async () => {
        const response = await ApiUtils.request("/api/users/guest", "POST")
        const [bResult, statusCode, resultData] = response
        // alert(resultData["message"] ?? "없음", resultData)
    }

    return children
}
