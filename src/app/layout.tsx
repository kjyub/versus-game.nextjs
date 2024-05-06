import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "VS 게임",
    description: "VS 게임",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="kr">
            <head>
                <FrontHead />
            </head>
            <body className={inter.className}>{children}</body>
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
