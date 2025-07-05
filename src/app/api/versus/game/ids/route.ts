import MVersusGame from '@/models/versus/MVersusGame';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  await DBUtils.connect();

  const gameAll = await MVersusGame.find({ isDeleted: false });

  const gameIds = gameAll.map((game) => String(game.nanoId));

  return ApiUtils.response(gameIds);
}
