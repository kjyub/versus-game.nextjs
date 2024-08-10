import { Session } from "next-auth"
import CommonUtils from "./CommonUtils"
import { NextRequest, NextResponse } from "next/server"
import { CookieConsts } from "@/types/ApiTypes"
import AuthUtils from "./AuthUtils"
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies"
import { RequestInit } from "next/dist/server/web/spec-extension/request"

type RequestMethodTypes = "GET" | "POST" | "PUT" | "DELETE" | (string & {})

export default class ApiUtils {
    // Request
    static async request(
        url: string,
        method: RequestMethodTypes,
        query: object = null,
        data: object = null,
        useCache: boolean = false, // true로 하면 캐시에 저장되서 한동안 같은 결과가 나온다.
    ): [boolean, number, object] {
        let bResult: boolean = false
        let statusCode: number = 200
        let resultData: object = {}

        let requestUrl = url
        let requestData = null

        if (query !== null) {
            const queryString = new URLSearchParams(query).toString()
            requestUrl = `${url}?${queryString}`
        }
        if (data !== null) {
            requestData = JSON.stringify(data)
        }

        let requestInit: RequestInit = {
            method: method,
            body: requestData,
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
        }
        if (!useCache) {
            requestInit["cache"] = "no-store"
        }

        await fetch(process.env.NEXT_PUBLIC_API_URL + requestUrl, requestInit)
            .then(async (response) => {
                // 결과
                statusCode = response.status
                if (statusCode >= 200 && statusCode < 300) {
                    bResult = true
                }
                resultData = await response.json()
            })
            .catch((error) => {
                console.log(error, process.env.NEXT_PUBLIC_API_URL + requestUrl)

                resultData = "Api Error"
            })

        if (process.env.NEXT_PUBLIC_IS_DEBUG == "1" && resultData === "Api Error") {
            await fetch("http://192.168.0.42:3000" + requestUrl, requestInit)
                .then(async (response) => {
                    // 결과
                    statusCode = response.status
                    if (statusCode >= 200 && statusCode < 300) {
                        bResult = true
                    }
                    resultData = await response.json()
                })
        }

        return [bResult, statusCode, resultData]
    }
    static async fileUpload(file: File): [boolean, number, object] {
        let bResult: boolean = false
        let statusCode: number = 200

        let resultData: object = {}

        const formData = new FormData()
        formData.append("files", file, file.name)

        await fetch("/api/files/upload_file", {
            method: "POST",
            body: formData,
            headers: {
                credentials: "include",
            },
        })
            .then(async (response) => {
                // 결과
                statusCode = response.status
                if (statusCode >= 200 && statusCode < 300) {
                    bResult = true
                }
                resultData = await response.json()
            })
            .catch((error) => {
                console.log(error)
                resultData = "에러"
            })

        return [bResult, statusCode, resultData]
    }

    // Response
    static parseData(data: any = {}) {
        if (typeof data === "string" || typeof data === "number") {
            data = { message: data }
        } else if (typeof data === "object") {
            data = data
        } else if (typeof data === "boolean") {
            data = data
        } else {
            data = {}
        }

        return data
    }
    static response(data: any = {}) {
        let response: NextResponse = NextResponse.json(this.parseData(data), {
            status: 200,
        })

        return response
    }
    static badRequest(data: any = {}, status: number = 400) {
        return NextResponse.json(this.parseData(data), { status: 400 })
    }
    static notAuth(data: any = {}) {
        return this.badRequest(data, 401)
    }
    static notFound(data: any = {}) {
        return this.badRequest(data, 404)
    }
    static serverError(data: any = {}) {
        return this.badRequest(data, 500)
    }

    static mediaUrl(_url) {
        if (!CommonUtils.isStringNullOrEmpty(_url)) {
            return "https://kr.cafe24obs.com/" + _url
        }

        return ""
    }
}
