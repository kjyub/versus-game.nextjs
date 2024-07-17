import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"
import CommonUtils from "@/utils/CommonUtils"
import MVersusGameView from "@/models/versus/MVersusGameView"
import { CookieConsts } from "@/types/ApiTypes"
import AuthUtils from "@/utils/AuthUtils"
import { cookies } from "next/headers"
import { getSession } from "next-auth/react"

export async function POST(req: NextRequest, { params }: { id: string }) {
    const { id } = params
    const cookieStore = cookies()

    let bResult: boolean = false

    await DBUtils.connect()
    const mGame = await MVersusGame.findOne({ nanoId: id, isDeleted: false })

    if (CommonUtils.isNullOrUndefined(mGame)) {
        return ApiUtils.notFound("게임을 찾을 수 없습니다.")
    }

    // 조회수 처리
    const session = await auth()

    let userId: string = AuthUtils.getUserOrGuestId(req, session)
    // 조회수 확인
    if (!CommonUtils.isStringNullOrEmpty(userId)) {
        const view = await MVersusGameView.findOne({
            gameId: mGame._id,
            userId: userId,
        })

        // 조회수 증가
        if (CommonUtils.isNullOrUndefined(view)) {
            const newView = new MVersusGameView({
                gameId: mGame._id,
                userId: userId,
            })
            const saved = await newView.save()

            bResult = true
        }
    }

    return ApiUtils.response(bResult)
}
