import { auth } from '@/auth';
import MUser from '@/models/user/MUser';
import MVersusGameComment from '@/models/versus/MVersusGameComment';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import type { NextRequest } from 'next/server';

// 유저가 댓글을 수정한다.
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { content } = await req.json();
  const { id } = params;

  await DBUtils.connect();

  // 댓글 확인
  const mComment = await MVersusGameComment.findOne({ _id: id, isDeleted: false });
  if (!mComment) {
    return ApiUtils.badRequest('댓글을 찾을 수 없습니다.');
  }

  // 유저 확인
  const session = await auth();
  if (!session) {
    return ApiUtils.notAuth('유저를 찾을 수 없습니다.');
  }

  // @ts-ignore
  const mUser = await MUser.findOne({ _id: session?.user._id });
  if (!mUser) {
    return ApiUtils.notAuth('유저를 찾을 수 없습니다.');
  }

  if (String(mUser._id) !== String(mComment.userId)) {
    return ApiUtils.badRequest('권한이 없습니다.');
  }

  // 수정
  mComment.content = content;

  try {
    const result = await mComment.save();

    return ApiUtils.response(result);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError(err);
  }
}

// 유저가 댓글을 삭제한다.
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  await DBUtils.connect();

  // 댓글 확인
  const mComment = await MVersusGameComment.findOne({ _id: id, isDeleted: false });
  if (!mComment) {
    return ApiUtils.badRequest('댓글을 찾을 수 없습니다.');
  }

  // 유저 확인
  const session = await auth();
  if (!session) {
    return ApiUtils.notAuth('유저를 찾을 수 없습니다.');
  }

  // @ts-ignore
  const mUser = await MUser.findOne({ _id: session?.user._id });
  if (!mUser) {
    return ApiUtils.notAuth('유저를 찾을 수 없습니다.');
  }

  if (String(mUser._id) !== String(mComment.userId)) {
    return ApiUtils.badRequest('권한이 없습니다.');
  }

  // 삭제
  mComment.isDeleted = true;

  try {
    const result = await mComment.save();

    return ApiUtils.response(result);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError(err);
  }
}
