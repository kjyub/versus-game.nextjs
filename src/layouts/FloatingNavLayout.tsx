'use client';

import { FloatingNavBackground, FloatingNavLayoutStyle, FloatingNavToggleButton } from '@/app/homeStyle';
import FloatingNote from '@/components/floatingBox/note/FloatingNote';
import FloatingUser from '@/components/floatingBox/user/FloatingUser';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function FloatingNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const [isShow, setShow] = useState<boolean>(false);

  if (session.status === 'loading') {
    return <></>;
  }

  return (
    <>
      <FloatingNavBackground
        $is_show={isShow}
        onClick={() => {
          setShow(false);
        }}
      ></FloatingNavBackground>
      <FloatingNavToggleButton
        $is_show={!isShow}
        onClick={() => {
          setShow(true);
        }}
      >
        <i className="fa-solid fa-user"></i>
      </FloatingNavToggleButton>
      <FloatingNavLayoutStyle $is_show={isShow}>
        <FloatingUser />
        <FloatingNote setFloatingNavShow={setShow} />
      </FloatingNavLayoutStyle>
    </>
  );
}
