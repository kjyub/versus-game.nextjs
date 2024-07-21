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
        gameId: String(mGame._id)
    }
    const filterGameChoiceId = req.nextUrl.searchParams.get("gameChoiceId")
    if (!CommonUtils.isStringNullOrEmpty(filterGameChoiceId)) {
        filter["gameChoiceId"] = filterGameChoiceId
    }

    // 페이지네이션
    let pageIndex = Number(req.nextUrl.searchParams.get("pageIndex") ?? -1)
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 50)
    const itemCount = await MVersusGameComment.countDocuments(filter)
    const maxPage = Math.ceil(itemCount / pageSize)

    if (pageIndex < 1) {
        pageIndex = maxPage
    }

    const comments = await MVersusGameComment.find(filter)
        .sort({ createdAt: 1 })
        .skip((pageIndex - 1) * pageSize)
        .limit(pageSize)
        .populate("user")

    const formattedData = comments.map(comment => ({
        ...comment._doc,
        created: CommonUtils.getMoment(comment.createdAt).fromNow(),
        updated: CommonUtils.getMoment(comment.updatedAt).fromNow(), // 상대 시간으로 포맷팅
    }));

    const result: IPaginationResponse = {
        itemCount: itemCount,
        pageIndex: pageIndex,
        maxPage: maxPage,
        items: formattedData
    }

        
    return ApiUtils.response(result)
}