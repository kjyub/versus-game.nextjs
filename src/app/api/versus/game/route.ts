import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"
import { nanoid } from "nanoid"
import AuthUtils from "@/utils/AuthUtils"
import { GameState, PrivacyTypes, ThumbnailImageTypes } from "@/types/VersusTypes"
import CommonUtils from "@/utils/CommonUtils"
import MUser from "@/models/user/MUser"
import { UserRole } from "@/types/UserTypes"
import mongoose, { mongo } from "mongoose"
import MVersusGameView from "@/models/versus/MVersusGameView"
import MVersusGameAnswer from "@/models/versus/MVersusGameAnswer"
import { IPaginationResponse } from "@/types/common/Responses"
import GameUtils from "@/utils/GameUtils"

export async function GET(req: NextRequest) {
    let filter = {
        isDeleted: false,
    }
    let addFields = []
    let lookUps = []
    let sort = { _id: -1}

    await DBUtils.connect()

    // 관리자 확인
    let isStaff = false
    const session = await auth()
    if (session) {
        const mUser = await MUser.findOne({ _id: session.user._id})
        if (mUser && mUser.userRole === UserRole.STAFF) {
            isStaff = true
        }
    }

    const searchValue = req.nextUrl.searchParams.get("search")
    if (searchValue !== null) {
        // 검색 우선순위 기능 보류 (필요없어 보임)
        // filter["title"] = new RegExp(searchValue, "i")
        // filter["$text"] = { $search: searchValue }
        // addFields.push({
        //     $addFields: {
        //         score: { $meta: 'textScore' }
        //     }
        // })
        // sort = {
        //     // "score": { $meta: "textScore" },
        //     // "text": 1,
        //     // "content": 1,
        //     // "choices.title": 1,
        //     "_id": -1
        // }
        filter["$or"] = [
            { "title": {"$regex": searchValue, "$options": "i"} },
            { "content": {"$regex": searchValue, "$options": "i"} },
            { "choices.title": {"$regex": searchValue, "$options": "i"} },
        ]
    }
    
    // 내 게임 필터링
    const myGames = req.nextUrl.searchParams.get("myGames")
    const userId = req.nextUrl.searchParams.get("userId")
    const userObjectId = new mongoose.Types.ObjectId(userId)

    // 내 게임이 활성화되고 userId가 있으면 내 게임만 검색한다.
    if (myGames !== null && !CommonUtils.isStringNullOrEmpty(userId)) {
        filter["userId"] = new mongoose.Types.ObjectId(userId)
    } else {
        // 공개 옵션 필터가 없는 경우 public으로만 검색한다.
        filter["privacyType"] = PrivacyTypes.PUBLIC

        // 스태프의 경우 전부 조회
        if (!isStaff) {
            filter["state"] = GameState.NORMAL
        }
    }

    // 참여한 게임 필터링
    const choiced = req.nextUrl.searchParams.get("choiced")
    if (choiced !== null && !CommonUtils.isStringNullOrEmpty(userId)) {
        addFields.push({
            $addFields: {
                _idString: { $toString: '$_id' }
            }
        })
        lookUps.push({
            $lookup: {
                from: "versus_game_answers",
                localField: "_idString",
                foreignField: "gameId",
                as: "answers"
            }
        })
        filter["answers.userId"] = userId
    }

    // 페이지네이션
    const lastId = req.nextUrl.searchParams.get("lastId") ?? ""
    if (!CommonUtils.isStringNullOrEmpty(lastId)) {
        filter["_id"] = { $lt: new mongoose.Types.ObjectId(lastId) }
    }
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 50)
    const itemAll = await MVersusGame.aggregate([
        ...addFields,
        ...lookUps,
        { $match: filter },
    ])
    const itemCount = itemAll.length
    const maxPage = Math.ceil(itemCount / pageSize)

    if (itemCount === 0) {
        const result: IPaginationResponse = {
            itemCount: 0,
            pageIndex: 1,
            maxPage: 0,
            lastId: "",
            items: []
        }
    
        return ApiUtils.response(result)
    }


    let items = await MVersusGame
        .aggregate([
            ...addFields,
            ...lookUps,
            { $match: filter },
            { $sort: sort },
            // { $skip: (pageIndex - 1) * pageSize },
            { $limit: pageSize },
            // { $addFields: { userObjectId: { $toObjectId: "$userId"} }},
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
        ])

    if (items.length === 0) {
        const result: IPaginationResponse = {
            itemCount: 0,
            pageIndex: 1,
            maxPage: 0,
            lastId: "",
            items: []
        }
    
        return ApiUtils.response(result)
    }
    
    // 이미 읽은 게시글인지 확인
    if (!CommonUtils.isStringNullOrEmpty(userId)) {
        items = await GameUtils.setIsViewAndChoiceGames(items, userId)
    }

    // const formattedItems = items.map(comment => ({
    //     ...comment._doc,
    //     created: CommonUtils.getMoment(comment.createdAt).fromNow(),
    //     updated: CommonUtils.getMoment(comment.updatedAt).fromNow(), // 상대 시간으로 포맷팅
    // }));

    const result: IPaginationResponse = {
        itemCount: itemCount,
        pageIndex: 1,
        maxPage: maxPage,
        lastId: items.length > 0 ? items[items.length - 1]._id : "",
        items: items
    }

    return ApiUtils.response(result)
}

export async function POST(req: NextRequest) {
    const { title, content, thumbnailImageId, thumbnailImageType, privacyType, choices, choiceCountType } =
        await req.json()

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    // 썸네일
    let thumbnailImageUrl = ""
    try {
        const mFile = await MFile.findOne({ _id: thumbnailImageId })
        if (mFile) {
            thumbnailImageUrl = mFile.url
        }
    } catch {
        //
    }

    // 선택지
    if (!Array.isArray(choices) || choices.length === 0) {
        return ApiUtils.badRequest("선택지 정보가 없습니다.")
    }

    const nanoId = nanoid(11)
    const mGame = new MVersusGame({
        nanoId: nanoId,
        title: title,
        content: content,
        userId: session?.user?._id,
        thumbnailImageId: thumbnailImageId,
        thumbnailImageUrl: thumbnailImageUrl,
        thumbnailImageType: thumbnailImageType,
        privacyType: privacyType,
        choices: choices,
        choiceCountType: choiceCountType,
    })

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError(err)
    }
}
