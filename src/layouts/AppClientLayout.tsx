"use client"

import ApiUtils from "@/utils/ApiUtils"
import { useEffect, useState } from "react"

export default function AppClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useEffect(() => {
        ApiUtils.request("/api/users/guest", "POST")
    }, [])

    return children
}
