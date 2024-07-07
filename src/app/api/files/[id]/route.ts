import DBUtils from "@/utils/DBUtils"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MFile from "@/models/file/MFile"

export async function GET(req: NextApiRequest, { params }: { id: string }) {
    const { id } = params

    await DBUtils.connect()
    const file = await MFile.findOne({ _id: id })
    if (!file) {
        return ApiUtils.badRequest("파일을 찾을 수 없습니다.")
    }

    return ApiUtils.response(file)
}

export async function PUT(req: NextApiRequest, { params }: { id: string }) {
    // const { id } = params
    // const data = await req.json()
    // await DBUtils.connect()
    // await MUser.findByIdAndUpdate(id, data).exec()
    // const user = await MUser.findOne({ _id: id })
    // if (!user) {
    //     return ApiUtils.badRequest("회원을 찾을 수 없습니다.")
    // }
    // return ApiUtils.response(user)
}
