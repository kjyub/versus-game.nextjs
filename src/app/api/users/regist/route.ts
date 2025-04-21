import MUser from '@/models/user/MUser'
import ApiUtils from '@/utils/ApiUtils'
import DBUtils from '@/utils/DBUtils'
import bcryptjs from 'bcryptjs'
import { NextApiRequest } from 'next'

export async function POST(req: NextApiRequest) {
  const { email, password, name } = await req.json()

  await DBUtils.connect()
  const users = await MUser.findOne({ email: email })
  if (users) {
    return ApiUtils.badRequest('이미 존재하는 이메일입니다.')
  }

  const hashedPassword = await bcryptjs.hash(password, 5)
  const mUser = new MUser({
    email: email,
    password: hashedPassword,
    name: name,
  })

  try {
    const resultUser = await mUser.save()

    return ApiUtils.response(resultUser)
  } catch (err: any) {
    console.log('에러', err)
    return ApiUtils.serverError(err)
  }
  // await DBUtils.insertDocument("VersusGame", "users", data)
  // return NextResponse.json({
  //     name: "John Doe",
  // })
}
