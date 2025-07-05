import MUser from '@/models/user/MUser';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  await DBUtils.connect();
  const users = await MUser.findOne({ email: email });

  let isExist = false;
  if (users) {
    isExist = true;
  }

  return ApiUtils.response(isExist);
}
