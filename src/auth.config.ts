import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // 유저 인증 확인
            const isLoggedIn = !!auth?.user
            // 보호하고 싶은 경로 설정
            // 여기서는 / 경로를 제외한 모든 경로가 보호 되었다
            const isOnProtected = !nextUrl.pathname.startsWith("/")

            if (isOnProtected) {
                if (isLoggedIn) return true
                return false // '/' 경로로 강제이동
            } else if (isLoggedIn) {
                // 홈페이지로 이동
                return Response.redirect(new URL("/", nextUrl))
            }
            return true
        },
    },
} satisfies NextAuthConfig
