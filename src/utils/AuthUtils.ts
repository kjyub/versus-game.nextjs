import { Session } from "next-auth"
import CommonUtils from "./CommonUtils"
import { cookies } from "next/headers"
import { CookieConsts } from "@/types/ApiTypes"
import { randomUUID } from "crypto"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export default class AuthUtils {
    static parseJwt(token: string): object {
        if (CommonUtils.isStringNullOrEmpty(token)) {
            return {}
        }

        const base64Url = token.split(".")[1]
        if (CommonUtils.isStringNullOrEmpty(base64Url)) {
            return {}
        }

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join(""),
        )

        return JSON.parse(jsonPayload)
    }
    static getTokenExpires(token: string): Date | null {
        if (CommonUtils.isStringNullOrEmpty(token)) {
            return null
        }

        const decodedToken = this.parseJwt(token)

        if (decodedToken.exp) {
            return new Date(decodedToken.exp * 1000) // 초 단위를 밀리초로 변환
        } else {
            return null
        }
    }
    static isExpiredToken(token: string): boolean {
        if (CommonUtils.isStringNullOrEmpty(token)) {
            return true
        }

        const expireDate = this.getTokenExpires(token)
        if (expireDate === null) {
            return false
        }

        const now = new Date()

        return expireDate.getTime() <= now.getTime()
    }
    static isSessionAuth(session: Session) {
        if (
            CommonUtils.isNullOrUndefined(session) ||
            CommonUtils.isNullOrUndefined(session.user)
        ) {
            return false
        }

        return true
    }
    static getUserOrGuestId(req: NextRequest, session: Session) {
        let userId: string = ""

        // 유저 확인 없으면 게스트
        if (this.isSessionAuth(session)) {
            userId = session?.user._id
        } else if (req.cookies.has(CookieConsts.GUEST_ID)) {
            const guestIdCookie = req.cookies.get(CookieConsts.GUEST_ID)
            userId = guestIdCookie.value
        } else {
            const newGuestId = randomUUID()
            cookies().set(CookieConsts.GUEST_ID, newGuestId, { httpOnly: true })
        }

        return userId
    }
    static getUserOrGuestIdBySSR(session: Session | null) {
        let userId: string = ""
        
        const currentCookies = cookies()

        // 유저 확인 없으면 게스트
        if (this.isSessionAuth(session)) {
            userId = session?.user._id
        } else if (currentCookies.has(CookieConsts.GUEST_ID)) {
            const guestIdCookie = currentCookies.get(CookieConsts.GUEST_ID)
            userId = guestIdCookie.value
        } else {
            // const newGuestId = randomUUID()
            // currentCookies.set(CookieConsts.GUEST_ID, newGuestId, { httpOnly: true })
        }

        return userId
    }
}
