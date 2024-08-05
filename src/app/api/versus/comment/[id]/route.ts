import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import MVersusGameAnswer from "@/models/versus/MVersusGameAnswer"
import { auth } from "@/auth"
import MFile from "@/models/file/MFile"
import CommonUtils from "@/utils/CommonUtils"
import AuthUtils from "@/utils/AuthUtils"
import { IPaginationResponse } from "@/types/common/Responses"
import MVersusGameComment from "@/models/versus/MVersusGameComment"
import MUser from "@/models/user/MUser"

// 게임의 댓글들을 반환한다.
export async function GET(req: NextRequest) {
    await DBUtils.connect()

    const filterGameNanoId = req.nextUrl.searchParams.get("gameNanoId")
    // 게임 확인
    if (CommonUtils.isStringNullOrEmpty(filterGameNanoId)) {
        return ApiUtils.badRequest("게임을 찾을 수 없습니다.")
    }

    const mGame = await MVersusGame.findOne({
        nanoId: filterGameNanoId,
        isDeleted: false,
    })
    if (CommonUtils.isNullOrUndefined(mGame)) {
        return ApiUtils.badRequest("게임을 찾을 수 없습니다.")
    }

    let filter = {
        gameId: String(mGame._id),
        isDeleted: false
    }
    const filterGameChoiceId = req.nextUrl.searchParams.get("gameChoiceId")
    if (!CommonUtils.isStringNullOrEmpty(filterGameChoiceId)) {
        filter["gameChoiceId"] = filterGameChoiceId
    }

    // 페이지네이션
    let pageIndex = Number(req.nextUrl.searchParams.get("pageIndex") ?? -1)
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 50)
    const itemCount = (await MVersusGameComment.aggregate([{ $match: filter }])).length
    const maxPage = Math.ceil(itemCount / pageSize)

    if (pageIndex < 1) {
        pageIndex = maxPage
    }

    if (itemCount === 0) {
        const result: IPaginationResponse = {
            itemCount: 0,
            pageIndex: 1,
            maxPage: 0,
            items: []
        }
    
        return ApiUtils.response(result)
    }

    const items = await MVersusGameComment
        .aggregate([
            { $match: filter },
            { $sort: { createdAt: 1 } },
            { $skip: (pageIndex - 1) * pageSize },
            { $limit: pageSize },
            { $addFields: { userObjectId: { $toObjectId: "$userId"} }},
            { $lookup: { from: "users", localField: "userObjectId", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
        ])
        // .find(filter)
        // .sort({ createdAt: 1 })
        // .skip((pageIndex - 1) * pageSize)
        // .limit(pageSize)
        // .populate("user")

    const formattedItems = items.map(comment => ({
        ...comment,
        created: CommonUtils.getMoment(comment.createdAt).fromNow(),
        updated: CommonUtils.getMoment(comment.updatedAt).fromNow(), // 상대 시간으로 포맷팅
    }));

    const result: IPaginationResponse = {
        itemCount: itemCount,
        pageIndex: pageIndex,
        maxPage: maxPage,
        items: formattedItems
    }
        
    return ApiUtils.response(result)
}

// 유저가 댓글을 수정한다.
export async function PUT(req: NextRequest, { params }: { id: string }) {
    const { content } = await req.json()
    const { id } = params

    await DBUtils.connect()

    // 댓글 확인
    let mComment = await MVersusGameComment.findOne({ _id: id, isDeleted: false })
    if (CommonUtils.isNullOrUndefined(mComment)) {
        return ApiUtils.badRequest("댓글을 찾을 수 없습니다.")
    }

    // 유저 확인
    const session = await auth()
    if (CommonUtils.isNullOrUndefined(session)) {
        return ApiUtils.notAuth("유저를 찾을 수 없습니다.")
    }

    const mUser = await MUser.findOne({ _id: session?.user._id })
    if (CommonUtils.isNullOrUndefined(mUser)) {
        return ApiUtils.notAuth("유저를 찾을 수 없습니다.")
    }

    if (String(mUser._id) !== String(mComment.userId)) {
        return ApiUtils.badRequest("권한이 없습니다.")
    }

    // 수정
    mComment.content = content

    try {
        const result = await mComment.save()

        return ApiUtils.response(result)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError(err)
    }
}

// 유저가 댓글을 삭제한다.
export async function DELETE(req: NextRequest, { params }: { id: string }) {
    const { id } = params

    await DBUtils.connect()

    // 댓글 확인
    let mComment = await MVersusGameComment.findOne({ _id: id, isDeleted: false })
    if (CommonUtils.isNullOrUndefined(mComment)) {
        return ApiUtils.badRequest("댓글을 찾을 수 없습니다.")
    }

    // 유저 확인
    const session = await auth()
    if (CommonUtils.isNullOrUndefined(session)) {
        return ApiUtils.notAuth("유저를 찾을 수 없습니다.")
    }

    const mUser = await MUser.findOne({ _id: session?.user._id })
    if (CommonUtils.isNullOrUndefined(mUser)) {
        return ApiUtils.notAuth("유저를 찾을 수 없습니다.")
    }

    if (String(mUser._id) !== String(mComment.userId)) {
        return ApiUtils.badRequest("권한이 없습니다.")
    }

    // 삭제
    mComment.isDeleted = true

    try {
        const result = await mComment.save()

        return ApiUtils.response(result)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError(err)
    }
}
