import { auth } from '@/auth'
import MUser from '@/models/user/MUser'
import MVersusGame from '@/models/versus/MVersusGame'
import MVersusGameComment from '@/models/versus/MVersusGameComment'
import ApiUtils from '@/utils/ApiUtils'
import CommonUtils from '@/utils/CommonUtils'
import DBUtils from '@/utils/DBUtils'
import { NextRequest } from 'next/server'

// 유저가 댓글을 작성한다.
export async function POST(req: NextRequest) {
  const { parentId, gameId, gameChoiceId, content } = await req.json()

  await DBUtils.connect()

  const session = await auth()
  if (CommonUtils.isNullOrUndefined(session)) {
    return ApiUtils.notAuth('로그인 후 이용 가능합니다.')
  }

  // 유저 확인
  const mUser = await MUser.findOne({ _id: session?.user._id })
  if (CommonUtils.isNullOrUndefined(mUser)) {
    return ApiUtils.notAuth('회원 정보를 찾을 수 없습니다.')
  }

  // 게임 확인
  const mGame = await MVersusGame.findOne({ _id: gameId, isDeleted: false })
  if (CommonUtils.isNullOrUndefined(mGame)) {
    return ApiUtils.badRequest('게임을 찾을 수 없습니다.')
  }

  // 생성
  let mComment = await MVersusGameComment({
    parentId: parentId,
    gameId: gameId,
    gameChoiceId: gameChoiceId,
    userId: session?.user._id,
    user: mUser,
    content: content,
  })

  try {
    const result = await mComment.save()

    return ApiUtils.response(result)
  } catch (err: any) {
    console.log('에러', err)
    return ApiUtils.serverError(err)
  }
}
