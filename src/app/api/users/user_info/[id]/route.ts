import MUser from "@/models/user/MUser"
import DBUtils from "@/utils/DBUtils"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import CommonUtils from "@/utils/CommonUtils"
import bcryptjs from "bcryptjs"
import { auth } from "@/auth"

export async function GET(req: NextApiRequest, { params }: { id: string }) {
    const { id } = params

    await DBUtils.connect()
    const user = await MUser.findOne({ _id: id })
    if (!user) {
        return ApiUtils.badRequest("회원을 찾을 수 없습니다.")
    }

    return ApiUtils.response(user)
}

export async function PUT(req: NextApiRequest, { params }: { id: string }) {
    const { id } = params
    let data = await req.json()

    await DBUtils.connect()

    const session = await auth()
    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    const user = await MUser.findOne({ _id: id })
    if (CommonUtils.isNullOrUndefined(user)) {
        return ApiUtils.notFound("회원을 찾을 수 없습니다.")
    }

    // 본인 데이터인지 확인
    if (session.user._id !== String(user._id)) {
        return ApiUtils.notAuth()
    }

    const passwordCurrent = data["passwordCurrent"] ?? ""
    const passwordNew = data["passwordNew"] ?? ""
    const passwordNewHashed = await bcryptjs.hash(passwordNew, 5)

    // 비밀번호 변경 요청이 있는 경우
    if (!CommonUtils.isStringNullOrEmpty(passwordCurrent)) {
        const isPasswordCorrect = await bcryptjs.compare(
            passwordCurrent,
            user.password,
        )

        // 현재 비밀번호가 다른 경우
        if (!isPasswordCorrect) {
            return ApiUtils.badRequest("현재 비밀번호가 틀립니다.")
        }
        if (CommonUtils.isStringNullOrEmpty(passwordNew)) {
            return ApiUtils.badRequest("새 비밀번호를 찾을 수 없습니다.")
        }

        data["password"] = passwordNewHashed
    }

    await MUser.findByIdAndUpdate(id, data).exec()

    const updatedUser = await MUser.findOne({ _id: id })

    if (!updatedUser) {
        return ApiUtils.badRequest("회원을 찾을 수 없습니다.")
    }

    return ApiUtils.response(updatedUser)
}
