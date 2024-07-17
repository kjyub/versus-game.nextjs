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

// 게임 별 결과들을 반환한다.
export async function GET(req: NextRequest) {
    let filter = {}

    const filterGameId = req.nextUrl.searchParams.get("gameId")
    if (filterGameId !== null) {
        filter["gameId"] = filterGameId
    }

    // 게임 확인
    if (CommonUtils.isStringNullOrEmpty(filterGameId)) {
        return ApiUtils.badRequest("게임을 찾을 수 없습니다.")
    }

    await DBUtils.connect()
    const mAnswers = await MVersusGameAnswer.find(filter)

    return ApiUtils.response(mAnswers)
}

// 유저가 게임의 선택지를 선택한다.
export async function POST(req: NextRequest) {
    const { gameId, gameAnswerId } = await req.json()

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    let userId: string = AuthUtils.getUserOrGuestId(req, session)

    // 게임 확인
    const mGame = await MVersusGame.findOne({ _id: gameId, isDeleted: false })
    if (CommonUtils.isNullOrUndefined(mGame)) {
        return ApiUtils.badRequest("게임을 찾을 수 없습니다.")
    }

    // 선택했던 적이 있는지 확인
    let mAnswer = await MVersusGameAnswer.findOne({
        gameId: mGame._id,
        userId: userId,
    })

    if (CommonUtils.isNullOrUndefined(mAnswer)) {
        // 선택한 적이 없는 경우
        mAnswer = new MVersusGameAnswer({
            gameId: gameId,
            gameChoiceId: gameAnswerId,
            userId: userId,
        })
    } else {
        // 선택한 적이 있는 경우
        mAnswer.gameChoiceId = gameAnswerId
    }

    try {
        const result = await mAnswer.save()

        return ApiUtils.response(result)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError(err)
    }
}
