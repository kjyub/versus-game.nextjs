import MUser from "@/models/user/MUser"
import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import { randomUUID } from "crypto"
import { cookies } from "next/headers"
import { CookieConsts } from "@/types/ApiTypes"
import CommonUtils from "@/utils/CommonUtils"
import {
    RequestCookie,
    ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import mongoose from "mongoose"

export async function POST(req: NextRequest) {
    const cookie: ReadonlyRequestCookies = cookies()
    const guestIdCookie: RequestCookie | undefined = cookie.get(
        CookieConsts.GUEST_ID,
    )

    await DBUtils.connect()

    let result = ""
    if (CommonUtils.isNullOrUndefined(guestIdCookie)) {
        // 게스트id가 저장되어 있지 않는 경우 설정
        const newGuestId = new mongoose.Types.ObjectId()
        cookie.set(CookieConsts.GUEST_ID, newGuestId, { httpOnly: true })
    } else {
        const guestId = guestIdCookie?.value
    }

    return ApiUtils.response(result)
}
