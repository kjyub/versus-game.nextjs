import { auth } from '@/auth';
import MUser from '@/models/user/MUser';
import MVersusGame from '@/models/versus/MVersusGame';
import { UserRole } from '@/types/UserTypes';
import { GameConsts } from '@/types/VersusTypes';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import GameUtils from '@/utils/GameUtils';
import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // 유저 확인
  const userId = req.nextUrl.searchParams.get('userId');

  await DBUtils.connect();
  const mGames = await MVersusGame.aggregate([
    { $match: { nanoId: id, isDeleted: false } },
    { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
    { $lookup: { from: 'users', localField: 'userObjectId', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $limit: 1 },
  ]);

  const mGame = mGames.length > 0 ? mGames[0] : null;

  if (!mGame) {
    return ApiUtils.notFound();
  }

  // 연관 게임
  const relatedGames = await GameUtils.getRelatedGames(mGame.relatedGameIds, userId);

  // 연관 게임이 없으면 게임을 랜덤으로 가져온다.
  let randomGames: Array<any> = [];
  if (relatedGames.length < GameConsts.RELATED_GAME_COUNT) {
    const excludeGameIds = relatedGames.length > 0 ? relatedGames.map((rg) => rg._id) : [];
    randomGames = await GameUtils.getRelatedRandomGames(excludeGameIds, userId);
  }

  let relatedGameAll: Array<any> = [...relatedGames, ...randomGames];
  // 이미 읽은 게시글인지 확인
  if (userId) {
    relatedGameAll = await GameUtils.setIsViewAndChoiceGames(relatedGameAll, userId);
  }

  mGame.relatedGames = relatedGameAll.slice(0, GameConsts.RELATED_GAME_COUNT);

  return ApiUtils.response(mGame);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const { title, content, privacyType, choices, choiceCount } = await req.json();

  await DBUtils.connect();

  const session = await auth();

  // 유저 확인
  if (!session || !session.user) {
    return ApiUtils.notAuth();
  }

  // 관리자 여부 확인
  let isStaff = false;
  // @ts-ignore
  const mUser = await MUser.findOne({ _id: session.user._id });
  if (mUser.userRole === UserRole.STAFF) {
    isStaff = true;
  }

  const mGame = await MVersusGame.findOne({ nanoId: id });

  // @ts-ignore
  if (mGame.userId !== session?.user._id && !isStaff) {
    return ApiUtils.notAuth();
  }

  // 선택지
  if (!Array.isArray(choices) || choices.length === 0) {
    return ApiUtils.badRequest('선택지 정보가 없습니다.');
  }

  mGame.title = title;
  mGame.content = content;
  // @ts-ignore
  mGame.userId = session?.user?._id;
  mGame.privacyType = privacyType;
  mGame.choices = choices;
  mGame.choiceCount = choiceCount;

  try {
    const resultGame = await mGame.save();
    revalidateTag(`games:view:${resultGame.nanoId}`);

    return ApiUtils.response(resultGame);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError();
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  await DBUtils.connect();

  const session = await auth();

  // 유저 확인
  if (!session || !session.user) {
    return ApiUtils.notAuth();
  }

  const mGame = await MVersusGame.findOne({ nanoId: id });

  // @ts-ignore
  if (mGame.userId !== session?.user._id) {
    return ApiUtils.notAuth();
  }

  const gameData = {
    isDeleted: true,
  };

  Object.assign(mGame, gameData);

  try {
    const resultGame = await mGame.save();
    revalidateTag('games:list');

    return ApiUtils.response(resultGame);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError();
  }
}
