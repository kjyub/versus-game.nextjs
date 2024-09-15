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
import MUser from "@/models/user/MUser"
import { UserRole } from "@/types/UserTypes"
import { GameConsts } from "@/types/VersusTypes"
import GameUtils from "@/utils/GameUtils"

export async function GET(req: NextRequest, { params }: { id: string }) {
    const { id } = params

    // const session = await auth()
    // // 유저 확인
    // if (CommonUtils.isNullOrUndefined(session.user)) {
    //     return ApiUtils.notAuth()
    // }
    // console.log(session)

    await DBUtils.connect()
    const mGames = await MVersusGame
        .aggregate([
            { $match: { nanoId: id, isDeleted: false } },
            { $addFields: { userObjectId: { $toObjectId: "$userId"} }},
            { $lookup: { from: "users", localField: "userObjectId", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $limit: 1 },
        ])

    const mGame = mGames.length > 0 ? mGames[0] : null

    if (CommonUtils.isNullOrUndefined(mGame)) {
        return ApiUtils.response(mGame)
    }

    // 연관 게임
    const relatedGames = await MVersusGame.find({ _id: { $in: mGame.relatedGameIds } })

    // 연관 게임이 없으면 게임을 랜덤으로 가져온다.
    let randomGames: Array<any> = []
    if (relatedGames.length < GameConsts.RELATED_GAME_COUNT) {
        const excludeGameIds = relatedGames.length > 0 ? relatedGames.map((rg) => rg._id) : []
        randomGames = await GameUtils.getRelatedRandomGames(excludeGameIds)
    }
    
    mGame.relatedGames = [...relatedGames, ...randomGames]

    return ApiUtils.response(mGame)
}

export async function PUT(req: NextRequest, { params }: { id: string }) {
    const { id } = params
    const { title, content, thumbnailImageId, thumbnailImageType, privacyType, choices, choiceCountType } =
        await req.json()

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }
    // 관리자 확인
    let isStaff = false
    const mUser = await MUser.findOne({ _id: session.user._id})
    if (mUser.userRole === UserRole.STAFF) {
        isStaff = true
    }

    let mGame = await MVersusGame.findOne({ nanoId: id })

    if (mGame["userId"] !== session?.user._id && !isStaff) {
        return ApiUtils.notAuth()
    }

    // 썸네일
    let thumbnailImageUrl = ""
    try {
        const mFile = await MFile.findOne({ _id: thumbnailImageId })
        if (mFile) {
            thumbnailImageUrl = mFile.url
        }
    } catch (err) {
        //
        console.log(err)
    }

    // 선택지
    if (!Array.isArray(choices) || choices.length === 0) {
        return ApiUtils.badRequest("선택지 정보가 없습니다.")
    }

    mGame.title = title
    mGame.content = content
    mGame.userId = session?.user?._id
    mGame.thumbnailImageId = thumbnailImageId
    mGame.thumbnailImageUrl = thumbnailImageUrl
    mGame.thumbnailImageType = thumbnailImageType
    mGame.privacyType = privacyType
    mGame.choices = choices
    mGame.choiceCountType = choiceCountType

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError()
    }
}

export async function DELETE(req: NextRequest, { params }: { id: string }) {
    const { id } = params

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    const mGame = await MVersusGame.findOne({ nanoId: id })

    if (mGame["userId"] !== session?.user._id) {
        return ApiUtils.notAuth()
    }

    const gameData = {
        isDeleted: true,
    }

    Object.assign(mGame, gameData)

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError()
    }
}
