import { auth } from '@/auth';
import MUser from '@/models/user/MUser';
import MVersusGame from '@/models/versus/MVersusGame';
import MVersusGameComment from '@/models/versus/MVersusGameComment';
import type { IPaginationResponse } from '@/types/common/Responses';
import ApiUtils from '@/utils/ApiUtils';
import CommonUtils from '@/utils/CommonUtils';
import DBUtils from '@/utils/DBUtils';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

// 게임의 댓글들을 반환한다.
export async function GET(req: NextRequest) {
  await DBUtils.connect();

  const filterGameNanoId = req.nextUrl.searchParams.get('gameNanoId');
  // 게임 확인
  if (!filterGameNanoId) {
    return ApiUtils.badRequest('게임을 찾을 수 없습니다.');
  }

  const mGame = await MVersusGame.findOne({
    nanoId: filterGameNanoId,
    isDeleted: false,
  });
  if (!mGame) {
    return ApiUtils.badRequest('게임을 찾을 수 없습니다.');
  }

  const filter: FilterQuery<typeof MVersusGameComment> = {
    gameId: String(mGame._id),
    isDeleted: false,
  };
  const filterGameChoiceId = req.nextUrl.searchParams.get('gameChoiceId');
  if (filterGameChoiceId) {
    filter.gameChoiceId = filterGameChoiceId;
  }

  // 페이지네이션
  let pageIndex = Number(req.nextUrl.searchParams.get('pageIndex') ?? -1);
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize') ?? 50);
  const itemCount = (await MVersusGameComment.aggregate([{ $match: filter }])).length;
  const maxPage = Math.ceil(itemCount / pageSize);

  if (pageIndex < 1) {
    pageIndex = maxPage;
  }

  if (itemCount === 0) {
    const result: IPaginationResponse = {
      itemCount: 0,
      pageIndex: 1,
      maxPage: 0,
      items: [],
      lastId: '',
    };

    return ApiUtils.response(result);
  }

  const items = await MVersusGameComment.aggregate([
    { $match: filter },
    { $sort: { createdAt: 1 } },
    { $skip: (pageIndex - 1) * pageSize },
    { $limit: pageSize },
    { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
    { $lookup: { from: 'users', localField: 'userObjectId', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
  ]);
  // .find(filter)
  // .sort({ createdAt: 1 })
  // .skip((pageIndex - 1) * pageSize)
  // .limit(pageSize)
  // .populate("user")

  const formattedItems = items.map((comment) => ({
    ...comment,
    created: CommonUtils.getDayjs(comment.createdAt).fromNow(),
    updated: CommonUtils.getDayjs(comment.updatedAt).fromNow(), // 상대 시간으로 포맷팅
  }));

  const result: IPaginationResponse = {
    itemCount: itemCount,
    pageIndex: pageIndex,
    maxPage: maxPage,
    items: formattedItems,
    lastId: formattedItems.length > 0 ? formattedItems[formattedItems.length - 1]._id : '',
  };

  return ApiUtils.response(result);
}

// 유저가 댓글을 작성한다.
export async function POST(req: NextRequest) {
  const { parentId, gameId, gameChoiceId, content } = await req.json();

  await DBUtils.connect();

  const session = await auth();
  if (!session) {
    return ApiUtils.notAuth('로그인 후 이용 가능합니다.');
  }

  // 유저 확인
  const mUser = await MUser.findOne({ _id: session?.user?._id });
  if (!mUser) {
    return ApiUtils.notAuth('회원 정보를 찾을 수 없습니다.');
  }

  // 게임 확인
  const mGame = await MVersusGame.findOne({ _id: gameId, isDeleted: false });
  if (!mGame) {
    return ApiUtils.badRequest('게임을 찾을 수 없습니다.');
  }

  // 생성
  const mComment = new MVersusGameComment({
    parentId: parentId,
    gameId: gameId,
    gameChoiceId: gameChoiceId,
    userId: session?.user?._id,
    user: mUser,
    content: content,
  });

  try {
    const result = await mComment.save();

    return ApiUtils.response(result);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError(err);
  }
}
