import MVersusGame from '@/models/versus/MVersusGame'
import { IPaginationResponse } from '@/types/common/Responses'
import ApiUtils from '@/utils/ApiUtils'
import DBUtils from '@/utils/DBUtils'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  await DBUtils.connect()

  const gameAll = await MVersusGame.find({ isDeleted: false })

  const gameIds = gameAll.map((game) => String(game.nanoId))

  const result: IPaginationResponse = gameIds

  return ApiUtils.response(result)
}
