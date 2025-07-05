import { TOAST_MESSAGE_ANIMATION_DURATION, TOAST_MESSAGE_DURATION } from '@/constants/ToastConsts';
import type React from 'react';
import { create } from 'zustand';

export interface ToastMessage {
  key: number;
  content: string | React.ReactNode;
}

interface IToastMessageStore {
  messages: ToastMessage[];
  createMessage: (content: string | React.ReactNode) => void;
  deleteMessage: (key: number) => void;
}
const useToastMessageStore = create<IToastMessageStore>((set) => ({
  messages: [],
  createMessage: (content: string | React.ReactNode) => {
    const timestamp = new Date().getTime();

    const message: ToastMessage = {
      key: timestamp,
      content,
    };

    // 메세지 추가
    set((state) => ({
      messages: [message, ...state.messages.filter((m) => m.key !== message.key)],
    }));

    // 시간 경과 후 메시지 삭제
    setTimeout(() => {
      set((state) => ({
        messages: state.messages.filter((m) => m.key !== message.key),
      }));
    }, TOAST_MESSAGE_DURATION + TOAST_MESSAGE_ANIMATION_DURATION);
  },
  deleteMessage: (key: number) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.key !== key),
    }));
  },
}));

export default useToastMessageStore;
