// import { getSession } from "next-auth/react"
import { auth } from '@/auth'
import ApiUtils from '@/utils/ApiUtils'
import { NextApiRequest, NextApiResponse } from 'next'

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // const { email } = await req.json()
  const session = await auth()
  console.log('user-check ', session)
  return ApiUtils.response(true)

  // await DBUtils.connect()
  // const users = await MUser.findOne({ email: email })

  // let isExist: boolean = false
  // if (users) {
  //     isExist = true
  // }

  // return ApiUtils.response(isExist)
}
