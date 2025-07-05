import type React from 'react';
import { create } from 'zustand';

export interface SystemMessageRequest {
  type: 'alert' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
  content: string | React.ReactNode;
}

export interface SystemMessage extends SystemMessageRequest {
  key: number;
  resolve: (value: boolean | PromiseLike<boolean>) => void;
}

interface ISystemMessageStore {
  messages: SystemMessage[];
  message: SystemMessage | null;
  createMessage: (data: SystemMessageRequest) => Promise<boolean>;
  deleteMessage: (key: number) => void;
}
const useSystemMessageStore = create<ISystemMessageStore>((set) => ({
  messages: [],
  message: null,
  createMessage: async (data: SystemMessageRequest) =>
    new Promise<boolean>((resolve) => {
      const timestamp = new Date().getTime();

      const message: SystemMessage = {
        key: timestamp,
        resolve,
        ...data,
      };

      set((state) => ({
        messages: [message, ...state.messages.filter((m) => m.key !== message.key)],
      }));

      return new Promise<boolean>(() => message.resolve);
    }),
  deleteMessage: (key: number) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.key !== key),
    }));
  },
}));

export default useSystemMessageStore;
