import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { User } from "@/lib/definitions"

// https://velog.io/@youngjun625/Next.js14-NextAuth-v5%EB%A1%9C-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-%EB%A1%9C%EA%B7%B8%EC%9D%B8%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83
export const { signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials.id && credentials.password) {
                    // 백엔드에서 로그인 처리
                    // let loginRes = await backendLogin(credentials.id, credentials.password)
                    let loginRes = {
                        success: true,
                        data: {
                            user: {
                                ID: "user1",
                                NAME: "홍길동",
                                EMAIL: "email@email.email",
                            },
                        },
                    }
                    // 로그인 실패 처리
                    if (!loginRes.success) return null
                    // 로그인 성공 처리
                    const user = {
                        id: loginRes.data.user.ID ?? "",
                        name: loginRes.data.user.NAME ?? "",
                        email: loginRes.data.user.EMAIL ?? "",
                    } as User
                    return user
                }
                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            session.user = token.user as User
            return session
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.user = user
            }
            return token
        },
    },
})
