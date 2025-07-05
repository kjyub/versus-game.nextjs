import { CookieConsts } from '@/types/ApiTypes';
import ApiUtils from '@/utils/ApiUtils';
import mongoose from 'mongoose';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

export async function POST() {
  const cookie: ReadonlyRequestCookies = await cookies();
  const newGuestId = new mongoose.Types.ObjectId();
  cookie.set(CookieConsts.GUEST_ID, newGuestId.toString(), { httpOnly: true, secure: true, sameSite: 'none' });

  return ApiUtils.response(newGuestId.toString());
}
