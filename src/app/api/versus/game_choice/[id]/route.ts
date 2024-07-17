import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import MVersusGameAnswer from "@/models/versus/MVersusGameAnswer"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"
import CommonUtils from "@/utils/CommonUtils"
import AuthUtils from "@/utils/AuthUtils"

// 유저가 선택한 선택지를 반환한다.
export async function GET(req: NextRequest, { params }: { id: string }) {
    const { id } = params

    const session = await auth()
    let userId: string = AuthUtils.getUserOrGuestId(req, session)

    // 유저가 없으면 끝
    if (CommonUtils.isStringNullOrEmpty(userId)) {
        return ApiUtils.response()
    }

    await DBUtils.connect()
    const mGame = await MVersusGame.findOne({ nanoId: id, isDeleted: false })
    if (CommonUtils.isNullOrUndefined(mGame)) {
        return ApiUtils.response()
    }

    const mAnswer = await MVersusGameAnswer.findOne({
        gameId: mGame._id,
        userId: userId,
    })
    if (CommonUtils.isNullOrUndefined(mAnswer)) {
        return ApiUtils.response()
    }

    return ApiUtils.response(mAnswer)
}
