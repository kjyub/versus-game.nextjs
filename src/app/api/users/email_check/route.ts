import MUser from '@/models/user/MUser';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import type { NextApiRequest } from 'next';

export async function POST(req: NextApiRequest) {
  const { email } = await req.json();

  await DBUtils.connect();
  const users = await MUser.findOne({ email: email });

  let isExist = false;
  if (users) {
    isExist = true;
  }

  return ApiUtils.response(isExist);
}
