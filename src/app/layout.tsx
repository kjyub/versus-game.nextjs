import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/commons/Navigation"
import * as MainStyles from "@/styles/MainStyles"

import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import BgBubbleBox from "@/components/backgrounds/BgBubbleBox"
import AppClientLayout from "@/layouts/AppClientLayout"
import ApiUtils from "@/utils/ApiUtils"

const inter = Inter({ subsets: ["latin"] })

async function generateGuestId() {
    await ApiUtils.request("/api/users/guest", "POST", null, null, true)
}

export const metadata: Metadata = {
    title: "VS 게임 추즈밍",
    description: "VS 게임 추즈밍",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()
    // await generateGuestId()

    return (
        <html lang="kr">
            <head>
                <FrontHead />
                <AppClientLayout />
            </head>
            <MainStyles.Body
                className={`${inter.className} background`}
                style={{
                    backgroundColor:
                        "repeating-linear-gradient(45deg, #444, #444 10px, #888 0, #888 20px)",
                }}
            >
                <BgBubbleBox />
                <SessionProvider session={session}>
                    <div id="layout" className={`absolute z-0 w-screen min-h-full h-full max-h-full overflow-hidden`}>
                        <Navigation />
                        <div id="page-root" className="flex flex-col w-full h-[calc(100%-3rem)] overflow-x-hidden overflow-y-auto scroll-transparent scroll-overlay">
                            {children}
                        </div>
                    </div>
                </SessionProvider>
            </MainStyles.Body>
        </html>
    )
}

const FrontHead = () => {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
            />
            {/* <script
                src="https://kit.fontawesome.com/181af83e33.js"
                crossOrigin="anonymous"
            ></script> */}
        </>
    )
}

export const viewport: Viewport = {
    themeColor: "#f92392",
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
}