import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/commons/Navigation"
import * as MainStyles from "@/styles/MainStyles"

import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import BgBubbleBox from "@/components/backgrounds/BgBubbleBox"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "VS 게임",
    description: "VS 게임",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()

    return (
        <html lang="kr">
            <head>
                <FrontHead />
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
                    <Navigation />
                    {children}
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
