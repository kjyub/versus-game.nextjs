'use server';

import { randomUUID } from 'crypto';
import { CookieConsts } from '@/types/ApiTypes';
import mongoose from 'mongoose';
import type { Session } from 'next-auth';
import { cookies } from 'next/headers';

function isSessionAuth(session: Session | null) {
  if (!session || !session.user) {
    return false;
  }

  return true;
}
export async function getUserOrGuestIdBySSR(session: Session | null) {
  let userId: string | mongoose.Types.ObjectId = '';

  const cookieStore = await cookies();
  console.log('cookieStore', cookieStore.get(CookieConsts.GUEST_ID));

  // 유저 확인 없으면 게스트
  if (isSessionAuth(session)) {
    // @ts-ignore
    userId = session?.user._id;
  } else if (cookieStore.has(CookieConsts.GUEST_ID)) {
    const guestIdCookie = cookieStore.get(CookieConsts.GUEST_ID);
    userId = new mongoose.Types.ObjectId(guestIdCookie?.value ?? '');
  } else {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/guest/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { message: newGuestId } = await response.json();
    console.log('updated guest id', newGuestId);
    userId = newGuestId;
    // const newGuestId = randomUUID() as string;
    // cookieStore.set(CookieConsts.GUEST_ID, newGuestId, { httpOnly: true });
  }

  return userId;
}
