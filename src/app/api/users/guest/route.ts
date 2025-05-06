import { CookieConsts } from "@/types/ApiTypes";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import mongoose from "mongoose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

export async function POST() {
  const cookie: ReadonlyRequestCookies = await cookies();
  const guestIdCookie: RequestCookie | undefined = cookie.get(CookieConsts.GUEST_ID);

  let result = "";
  if (!guestIdCookie) {
    // 게스트id가 저장되어 있지 않는 경우 설정
    const newGuestId = new mongoose.Types.ObjectId();
    cookie.set(CookieConsts.GUEST_ID, newGuestId, { httpOnly: true });
  } else {
    // const guestId = guestIdCookie?.value
  }

  return ApiUtils.response(result);
}
