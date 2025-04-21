import { auth } from '@/auth'
import MVersusGame from '@/models/versus/MVersusGame'
import MVersusGameAnswer from '@/models/versus/MVersusGameAnswer'
import ApiUtils from '@/utils/ApiUtils'
import AuthUtils from '@/utils/AuthUtils'
import CommonUtils from '@/utils/CommonUtils'
import DBUtils from '@/utils/DBUtils'
import { NextRequest } from 'next/server'

const gameChoiceView = async (userId: string, gameId: string) => {
  // 유저가 없으면 끝
  if (CommonUtils.isStringNullOrEmpty(userId)) {
    return ApiUtils.response()
  }

  await DBUtils.connect()
  const mGame = await MVersusGame.findOne({ nanoId: gameId, isDeleted: false })
  if (CommonUtils.isNullOrUndefined(mGame)) {
    return ApiUtils.response()
  }

  const mAnswer = await MVersusGameAnswer.findOne({
    gameId: mGame._id,
    userId: userId,
  })
  if (CommonUtils.isNullOrUndefined(mAnswer)) {
    return ApiUtils.response()
  }

  return ApiUtils.response(mAnswer)
}

// 유저가 선택한 선택지를 반환한다.
export async function GET(req: NextRequest, { params }: { id: string }) {
  const { id } = params

  const session = await auth()
  let userId: string = AuthUtils.getUserOrGuestId(req, session)

  return gameChoiceView(userId, id)
}

// 유저가 선택한 선택지를 반환한다.
// SSR에서 요청 (data에 userId 넣어서 요청)
export async function POST(req: NextRequest, { params }: { id: string }) {
  const { id } = params
  const { userId } = await req.json()

  return gameChoiceView(userId, id)
}
