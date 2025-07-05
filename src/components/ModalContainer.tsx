'use client';

import { TOAST_MESSAGE_DURATION } from '@/constants/ToastConsts';
import useIsClient from '@/hooks/useIsClient';
import useToastMessageStore from '@/stores/zustands/useToastMessageStore';
import type { StyleProps } from '@/types/StyleTypes';
import { cn } from '@/utils/StyleUtils';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import tw from 'tailwind-styled-components';

const Dimmer = tw.div<StyleProps>`
  absolute inset-0 z-0
  flex flex-center bg-black/30 w-screen h-dvh
  ${({ $is_active }) => !$is_active && 'opacity-0'}
  transition-all duration-200
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return createPortal(children, document.getElementById('portal') as HTMLElement);
};

const Wrapper = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-center">
      <div
        className={cn([
          'z-10 transition-all duration-200 will-change-transform [&>div]:backdrop-blur-none',
          { 'opacity-0 scale-97': !isOpen },
          { 'opacity-100 scale-100': isOpen },
        ])}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      {isOpen && <div className="absolute z-0 w-[100%] h-[100%] backdrop-blur-xl rounded-xl"></div>}
    </div>
  );
};

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEscClose?: boolean;
  isDirectClose?: boolean;
  zIndex?: number;
  children: React.ReactNode;
}
export default function ModalContainer({
  isOpen,
  setIsOpen,
  isEscClose = true,
  isDirectClose = true,
  zIndex = 60,
  children,
}: Props) {
  const isCloseTryRef = useRef<boolean>(false);
  const isCloseTryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  useEffect(() => {
    if (isEscClose && isDirectClose) {
      const handleEscClose = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      if (isOpen) {
        window.addEventListener('keydown', handleEscClose);
      } else {
        window.removeEventListener('keydown', handleEscClose);
      }
    }
  }, [isOpen, isEscClose, setIsOpen, isDirectClose]);

  const handleClose = () => {
    if (isDirectClose) {
      setIsOpen(false);
      return;
    }

    if (isCloseTryRef.current && isCloseTryTimerRef.current) {
      isCloseTryRef.current = false;
      clearTimeout(isCloseTryTimerRef.current);
      isCloseTryTimerRef.current = null;
      setIsOpen(false);
      return;
    }

    createToastMessage('닫을려면 한번 더 눌러주세요.');
    isCloseTryRef.current = true;
    isCloseTryTimerRef.current = setTimeout(() => {
      isCloseTryRef.current = false;
      isCloseTryTimerRef.current = null;
      setIsOpen(false);
    }, TOAST_MESSAGE_DURATION);
  };

  return (
    <Layout>
      <div
        className={cn(['fixed inset-0 flex flex-center w-screen h-dvh', { 'pointer-events-none': !isOpen }])}
        style={{ zIndex }}
      >
        <Dimmer onClick={() => handleClose()} $is_active={isOpen} />
        <Wrapper isOpen={isOpen}>{children}</Wrapper>
      </div>
    </Layout>
  );
}
