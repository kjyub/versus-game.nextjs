'use client';
import { TOAST_MESSAGE_ANIMATION_DURATION, TOAST_MESSAGE_DURATION } from '@/constants/ToastConsts';
import useToastMessageStore, { type ToastMessage } from '@/stores/zustands/useToastMessageStore';
import { cn } from '@/utils/StyleUtils';
import { useEffect, useState } from 'react';

const ToastPopup = () => {
  const messages = useToastMessageStore((state) => state.messages);

  return (
    <div className="fixed top-14 left-0 z-100 flex justify-center w-full pt-3 pointer-events-none">
      <div className="relative flex flex-col items-center max-w-[70vw] w-full duration-300">
        {messages.map((message: ToastMessage) => (
          <Message key={message.key} message={message} />
        ))}
      </div>
    </div>
  );
};
export default ToastPopup;

const Message = ({ message }: { message: ToastMessage }) => {
  const deleteMessage = useToastMessageStore((state) => state.deleteMessage);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isHide, setIsHide] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 50);
    setTimeout(() => {
      setIsHide(true);
    }, TOAST_MESSAGE_DURATION);
    setTimeout(() => {
      deleteMessage(message.key);
    }, TOAST_MESSAGE_DURATION + TOAST_MESSAGE_ANIMATION_DURATION);
  }, []);

  const handleClose = () => {
    setIsHide(true);
    setTimeout(() => {
      deleteMessage(message.key);
    }, TOAST_MESSAGE_ANIMATION_DURATION);
  };

  return (
    <div
      className={cn([
        'will-change-transform pointer-events-auto',
        { '-translate-y-10 opacity-0': !isShow },
        { 'translate-y-0 opacity-100 mb-2': isShow },
        { 'opacity-100': !isHide },
        { 'opacity-0 translate-x-36': isHide },
      ])}
      style={{ maxHeight: isShow ? '36px' : '0', transitionDuration: `${TOAST_MESSAGE_ANIMATION_DURATION}ms` }} // tailwind 변수 테스트
    >
      <div
        className={cn([
          'flex flex-center h-9 px-4 space-x-3',
          'rounded-full bg-black/40 backdrop-blur-sm',
          'text-stone-200/90',
        ])}
      >
        <div className="">{message.content}</div>
        <button className="text-stone-400 hover:text-stone-200 transition-colors" onClick={handleClose} type="button">
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
    </div>
  );
};
