import { auth } from '@/auth';
import MFile from '@/models/file/MFile';
import MUser from '@/models/user/MUser';
import MVersusGame from '@/models/versus/MVersusGame';
import { UserRole } from '@/types/UserTypes';
import { GameState, PrivacyTypes } from '@/types/VersusTypes';
import type { IPaginationResponse } from '@/types/common/Responses';
import VersusGame from '@/types/versus/VersusGame';
import ApiUtils from '@/utils/ApiUtils';
import CommonUtils from '@/utils/CommonUtils';
import DBUtils from '@/utils/DBUtils';
import GameUtils from '@/utils/GameUtils';
import mongoose, { type FilterQuery } from 'mongoose';
import { nanoid } from 'nanoid';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const filter: FilterQuery<typeof MVersusGame> = {
    isDeleted: false,
  };
  const addFields = [];
  const lookUps = [];
  const sort: Record<string, 1 | -1> = { _id: -1 };

  await DBUtils.connect();

  // 관리자 확인
  let isStaff = false;
  const session = await auth();
  if (session) {
    // @ts-ignore
    const mUser = await MUser.findOne({ _id: session.user._id });
    if (mUser && mUser.userRole === UserRole.STAFF) {
      isStaff = true;
    }
  }

  const searchValue = req.nextUrl.searchParams.get('search');
  if (searchValue !== null) {
    // 검색 우선순위 기능 보류 (필요없어 보임)
    // filter["title"] = new RegExp(searchValue, "i")
    // filter["$text"] = { $search: searchValue }
    // addFields.push({
    //     $addFields: {
    //         score: { $meta: 'textScore' }
    //     }
    // })
    // sort = {
    //     // "score": { $meta: "textScore" },
    //     // "text": 1,
    //     // "content": 1,
    //     // "choices.title": 1,
    //     "_id": -1
    // }
    filter.$or = [
      { title: { $regex: searchValue, $options: 'i' } },
      { content: { $regex: searchValue, $options: 'i' } },
      { 'choices.title': { $regex: searchValue, $options: 'i' } },
    ];
  }

  // 내 게임 필터링
  const myGames = req.nextUrl.searchParams.get('myGames');
  const userId = req.nextUrl.searchParams.get('userId');
  const userObjectId = new mongoose.Types.ObjectId(userId ?? '');

  // 내 게임이 활성화되고 userId가 있으면 내 게임만 검색한다.
  if (myGames !== null && userId) {
    filter.userId = new mongoose.Types.ObjectId(userId);
  } else {
    // 공개 옵션 필터가 없는 경우 public으로만 검색한다.
    filter.privacyType = PrivacyTypes.PUBLIC;

    // 스태프의 경우 전부 조회
    if (!isStaff) {
      filter.state = GameState.NORMAL;
    }
  }

  // 참여한 게임 필터링
  const choiced = req.nextUrl.searchParams.get('choiced');
  if (choiced !== null && userId) {
    addFields.push({
      $addFields: {
        _idString: { $toString: '$_id' },
      },
    });
    lookUps.push({
      $lookup: {
        from: 'versus_game_answers',
        localField: '_idString',
        foreignField: 'gameId',
        as: 'answers',
      },
    });
    filter['answers.userId'] = userId;
  }

  // 페이지네이션
  const lastId = req.nextUrl.searchParams.get('lastId') ?? '';
  if (lastId) {
    filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
  }
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize') ?? 50);
  const itemAll = await MVersusGame.aggregate([...addFields, ...lookUps, { $match: filter }]);
  const itemCount = itemAll.length;
  const maxPage = Math.ceil(itemCount / pageSize);

  if (itemCount === 0) {
    const result: IPaginationResponse = {
      itemCount: 0,
      pageIndex: 1,
      maxPage: 0,
      lastId: '',
      items: [],
    };

    return ApiUtils.response(result);
  }

  let items = await MVersusGame.aggregate([
    ...addFields,
    ...lookUps,
    { $match: filter },
    { $sort: sort },
    // { $skip: (pageIndex - 1) * pageSize },
    { $limit: pageSize },
    // { $addFields: { userObjectId: { $toObjectId: "$userId"} }},
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
  ]);

  if (items.length === 0) {
    const result: IPaginationResponse = {
      itemCount: 0,
      pageIndex: 1,
      maxPage: 0,
      lastId: '',
      items: [],
    };

    return ApiUtils.response(result);
  }

  // 이미 읽은 게시글인지 확인
  if (userId) {
    items = await GameUtils.setIsViewAndChoiceGames(items, userId);
  }

  // const formattedItems = items.map(comment => ({
  //     ...comment._doc,
  //     created: CommonUtils.getMoment(comment.createdAt).fromNow(),
  //     updated: CommonUtils.getMoment(comment.updatedAt).fromNow(), // 상대 시간으로 포맷팅
  // }));

  const result: IPaginationResponse = {
    itemCount: itemCount,
    pageIndex: 1,
    maxPage: maxPage,
    lastId: items.length > 0 ? items[items.length - 1]._id : '',
    items: items,
  };

  return ApiUtils.response(result);
}

export async function POST(req: NextRequest) {
  const { title, content, privacyType, choices, choiceCount } = await req.json();

  await DBUtils.connect();

  const session = await auth();

  // 유저 확인
  if (!session || !session.user) {
    return ApiUtils.notAuth();
  }

  // 선택지
  if (!Array.isArray(choices) || choices.length === 0) {
    return ApiUtils.badRequest('선택지 정보가 없습니다.');
  }

  const nanoId = nanoid(11);
  const mGame = new MVersusGame({
    nanoId: nanoId,
    title: title,
    content: content,
    // @ts-ignore
    userId: session.user._id,
    privacyType: privacyType,
    choices: choices,
    choiceCount: choiceCount,
  });

  try {
    const resultGame = await mGame.save();

    return ApiUtils.response(resultGame);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError(err);
  }
}
