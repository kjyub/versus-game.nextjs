import { auth } from '@/auth';
import MUser from '@/models/user/MUser';
import MVersusGame from '@/models/versus/MVersusGame';
import { UserRole } from '@/types/UserTypes';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, props: { params: { id: string } }) {
  const params = await props.params;
  const { id } = params;

  // const session = await auth()
  // // 유저 확인
  // if (CommonUtils.isNullOrUndefined(session.user)) {
  //     return ApiUtils.notAuth()
  // }
  // console.log(session)

  await DBUtils.connect();
  const mGame = await MVersusGame.findOne({ nanoId: id, isDeleted: false });

  // if (mGame["userId"] !== session?.user._id) {
  //     return ApiUtils.notAuth()
  // }

  return ApiUtils.response(mGame);
}

export async function PUT(req: NextRequest, props: { params: { id: string } }) {
  const params = await props.params;
  const { id } = params;
  const { state, privacyType } = await req.json();

  await DBUtils.connect();

  const session = await auth();

  // 유저 확인
  if (!session || !session.user) {
    return ApiUtils.notAuth();
  }
  // 관리자 확인
  // @ts-ignore
  const mUser = await MUser.findOne({ _id: session.user._id });
  if (mUser.userRole !== UserRole.STAFF) {
    return ApiUtils.notAuth('권한이 없습니다.');
  }

  const mGame = await MVersusGame.findOne({ nanoId: id });

  mGame.state = state;
  mGame.privacyType = privacyType;

  try {
    const resultGame = await mGame.save();

    return ApiUtils.response(resultGame);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError();
  }
}

export async function DELETE(req: NextRequest, props: { params: { id: string } }) {
  const params = await props.params;
  const { id } = params;

  await DBUtils.connect();

  const session = await auth();

  // 유저 확인
  if (!session || !session.user) {
    return ApiUtils.notAuth();
  }

  // 관리자 확인
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

  const gameData = {
    isDeleted: true,
  };

  Object.assign(mGame, gameData);

  try {
    const resultGame = await mGame.save();

    return ApiUtils.response(resultGame);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError();
  }
}
