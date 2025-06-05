import { randomUUID } from 'crypto';
import { CookieConsts } from '@/types/ApiTypes';
import mongoose from 'mongoose';
import type { Session } from 'next-auth';
import { type UnsafeUnwrappedCookies, cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import CommonUtils from './CommonUtils';

namespace AuthUtils {
  export function parseJwt(token: string): Record<string, any> {
    if (!token) {
      return {};
    }

    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return {};
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
  export function getTokenExpires(token: string): Date | null {
    if (!token) {
      return null;
    }

    const decodedToken = AuthUtils.parseJwt(token);

    if (decodedToken.exp) {
      return new Date(decodedToken.exp * 1000); // 초 단위를 밀리초로 변환
    } else {
      return null;
    }
  }
  export function isExpiredToken(token: string): boolean {
    if (!token) {
      return true;
    }

    const expireDate = AuthUtils.getTokenExpires(token);
    if (expireDate === null) {
      return false;
    }

    const now = new Date();

    return expireDate.getTime() <= now.getTime();
  }
  export function isSessionAuth(session: Session | null) {
    if (!session || !session.user) {
      return false;
    }

    return true;
  }
  export async function getUserOrGuestId(req: NextRequest, session: Session) {
    let userId: string | mongoose.Types.ObjectId = '';

    // 유저 확인 없으면 게스트
    if (AuthUtils.isSessionAuth(session)) {
      console.log('session', session);
      // @ts-ignore
      userId = session?.user._id;
    } else if (req.cookies.has(CookieConsts.GUEST_ID)) {
      const guestIdCookie = req.cookies.get(CookieConsts.GUEST_ID);
      console.log('guestIdCookie', guestIdCookie);
      userId = new mongoose.Types.ObjectId(guestIdCookie?.value ?? '');
    } else {
      const newGuestId = randomUUID() as string;
      (await cookies()).set(CookieConsts.GUEST_ID, newGuestId, { httpOnly: true });
      console.log('newGuestId', newGuestId);
    }

    return userId;
  }
  export async function getUserOrGuestIdBySSR(session: Session | null) {
    let userId: string | mongoose.Types.ObjectId = '';

    const currentCookies = (await cookies()) as unknown as UnsafeUnwrappedCookies;

    // 유저 확인 없으면 게스트
    if (AuthUtils.isSessionAuth(session)) {
      // @ts-ignore
      userId = session?.user._id;
    } else if (currentCookies.has(CookieConsts.GUEST_ID)) {
      const guestIdCookie = currentCookies.get(CookieConsts.GUEST_ID);
      userId = new mongoose.Types.ObjectId(guestIdCookie?.value ?? '');
    } else {
      const newGuestId = randomUUID() as string;
      currentCookies.set(CookieConsts.GUEST_ID, newGuestId, { httpOnly: true });
    }

    return userId;
  }
}

export default AuthUtils;
