// import NextAuth from "next-auth"
// import { authConfig } from "./auth.config"

// export default NextAuth(authConfig).auth

// export const config = {
//     // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//     matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// }

// import { auth } from "@/auth"
// import { privateRoutes,
//          authRoutes,
//          DEFAULT_REDIRECT_LOGIN_URL,
//          DEFAULT_REDIRECT_HOME_URL } from './routes';

// export const config = {
//     matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// }

export { auth as middleware } from "@/auth"
