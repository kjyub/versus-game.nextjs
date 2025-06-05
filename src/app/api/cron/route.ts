import ApiUtils from '@/utils/ApiUtils';
import GameUtils from '@/utils/GameUtils';
import { type NextRequest, NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return ApiUtils.notAuth();
  }

  try {
    GameUtils.updateRelatedGames();
  } catch (error) {
    //
  }

  return NextResponse.json({ ok: true });
}
