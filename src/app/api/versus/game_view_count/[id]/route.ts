import MVersusGame from '@/models/versus/MVersusGame'
import MVersusGameView from '@/models/versus/MVersusGameView'
import ApiUtils from '@/utils/ApiUtils'
import CommonUtils from '@/utils/CommonUtils'
import DBUtils from '@/utils/DBUtils'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest, { params }: { id: string }) {
  const { id } = params
  const { userId } = await req.json()

  let bResult: boolean = false

  await DBUtils.connect()
  const mGame = await MVersusGame.findOne({ nanoId: id, isDeleted: false })

  if (CommonUtils.isNullOrUndefined(mGame)) {
    return ApiUtils.notFound('게임을 찾을 수 없습니다.')
  }

  // 게스트ID도 없으면 에러
  if (CommonUtils.isStringNullOrEmpty(userId)) {
    return ApiUtils.notFound('유저를 찾을 수 없습니다.')
  }

  // 조회수 처리
  const view = await MVersusGameView.findOne({
    gameId: mGame._id,
    userId: userId,
  })

  // 조회수 증가
  if (CommonUtils.isNullOrUndefined(view)) {
    const newView = new MVersusGameView({
      gameId: mGame._id,
      userId: userId,
    })
    const saved = await newView.save()

    bResult = true
  }

  return ApiUtils.response(bResult)
}
