import CommonUtils from "./CommonUtils"

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
}
