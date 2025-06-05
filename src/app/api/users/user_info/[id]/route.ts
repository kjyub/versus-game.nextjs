import { auth } from '@/auth';
import MUser from '@/models/user/MUser';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import bcryptjs from 'bcryptjs';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return ApiUtils.badRequest('회원을 찾을 수 없습니다.');
  }

  await DBUtils.connect();
  const user = await MUser.findOne({ _id: id });
  if (!user) {
    return ApiUtils.badRequest('회원을 찾을 수 없습니다.');
  }

  // await Promise.all((await MUser.find()).map(async(mUser) => {
  //     mUser.userRole = UserRole.USER
  //     await mUser.save()
  // }))

  return ApiUtils.response(user);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const data = await req.json();

  await DBUtils.connect();

  const session = await auth();
  // 유저 확인
  if (!session || !session.user) {
    return ApiUtils.notAuth();
  }

  const user = await MUser.findOne({ _id: id });
  if (!user) {
    return NextResponse.json({ result: false, message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  // 본인 데이터인지 확인
  // @ts-ignore
  if (session.user._id !== String(user._id)) {
    return ApiUtils.notAuth('권한이 없습니다.');
  }

  const passwordCurrent = data.passwordCurrent ?? '';
  const passwordNew = data.passwordNew ?? '';
  const passwordNewHashed = await bcryptjs.hash(passwordNew, 5);

  // 비밀번호 변경 요청이 있는 경우
  if (passwordCurrent) {
    const isPasswordValid = await bcryptjs.compare(passwordCurrent, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ result: false, message: '현재 비밀번호가 일치하지 않습니다.' }, { status: 400 });
    }

    if (!passwordNew) {
      return NextResponse.json({ result: false, message: '새 비밀번호를 입력해주세요.' }, { status: 400 });
    }
  }

  data.password = passwordNewHashed;

  await MUser.findByIdAndUpdate(id, data).exec();

  const updatedUser = await MUser.findOne({ _id: id });

  if (!updatedUser) {
    return ApiUtils.badRequest('회원을 찾을 수 없습니다.');
  }

  return ApiUtils.response(updatedUser);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const data = await req.json();

  await DBUtils.connect();

  const session = await auth();
  // 유저 확인
  if (!session || !session.user) {
    return ApiUtils.notAuth();
  }

  const mUser = await MUser.findOne({ _id: id });
  if (!mUser) {
    return NextResponse.json({ result: false, message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  // 본인 데이터인지 확인
  // @ts-ignore
  if (session.user._id !== String(mUser._id)) {
    return ApiUtils.notAuth('권한이 없습니다.');
  }

  const passwordCurrent = data.passwordCurrent ?? '';

  // 비밀번호 변경 요청이 있는 경우
  if (passwordCurrent) {
    const isPasswordValid = await bcryptjs.compare(passwordCurrent, mUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ result: false, message: '현재 비밀번호가 일치하지 않습니다.' }, { status: 400 });
    }
  }

  mUser.email = `${mUser.email}$${nanoid(6)}`;
  mUser.isDeleted = true;

  try {
    const resultUser = await mUser.save();

    return ApiUtils.response(resultUser);
  } catch (err: any) {
    console.log('에러', err);
    return ApiUtils.serverError(err);
  }
}
