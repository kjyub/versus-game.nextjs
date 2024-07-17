import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGameAnswer from "@/models/versus/MVersusGameAnswer"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"
import { nanoid } from "nanoid"
import AuthUtils from "@/utils/AuthUtils"
import CommonUtils from "@/utils/CommonUtils"
import MVersusGame from "@/models/versus/MVersusGame"
import MVersusGameComment from "@/models/versus/MVersusGameComment"
import { IPaginationResponse } from "@/types/common/Responses"

// 유저가 댓글을 작성한다.
export async function POST(req: NextRequest) {
    const { parentId, gameId, gameChoiceId, content } = await req.json()

    await DBUtils.connect()

    const session = await auth()
    if (CommonUtils.isNullOrUndefined(session)) {
        return ApiUtils.notAuth()
    }

    // 게임 확인
    const mGame = await MVersusGame.findOne({ _id: gameId, isDeleted: false })
    if (CommonUtils.isNullOrUndefined(mGame)) {
        return ApiUtils.badRequest("게임을 찾을 수 없습니다.")
    }

    // 생성
    let mComment = await MVersusGameComment({
        parentId: parentId,
        gameId: gameId,
        gameChoiceId: gameChoiceId,
        userId: session?.user._id,
        content: content
    })

    try {
        const result = await mComment.save()

        return ApiUtils.response(result)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError(err)
    }
}
