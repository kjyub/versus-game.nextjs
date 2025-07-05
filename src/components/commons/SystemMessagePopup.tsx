'use client';
import useSystemMessageStore, { type SystemMessage } from '@/stores/zustands/useSystemMessageStore';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import ModalContainer from '../ModalContainer';

const SystemMessagePopup = () => {
  const messages = useSystemMessageStore((state) => state.messages);
  const [message, setMessage] = useState<SystemMessage | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    } else {
      timerRef.current = setTimeout(() => {
        setMessage(null);
      }, 200);
    }
  }, [messages]);

  return (
    // ModalContainer의 isOpen엔 message값으로 넣어서 미리 isOpen을 끈다. (애니메이션)
    <ModalContainer isOpen={messages.length > 0} setIsOpen={() => {}} zIndex={70}>
      {message && <Wrapper message={message} />}
    </ModalContainer>
  );
};
export default SystemMessagePopup;

const Wrapper = ({ message }: { message: SystemMessage }) => {
  const deleteMessage = useSystemMessageStore((state) => state.deleteMessage);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleConfirm = () => {
    message.onConfirm?.();
    message.resolve(true);
    deleteMessage(message.key);
  };
  const handleCancel = () => {
    if (message.type === 'alert') return;

    message.onCancel?.();
    message.resolve(false);
    deleteMessage(message.key);
  };

  if (message.type === 'alert') {
    return <Alert message={message} onConfirm={handleConfirm} />;
  } else if (message.type === 'confirm') {
    return <Confirm message={message} onConfirm={handleConfirm} onCancel={handleCancel} />;
  } else {
    return null;
  }
};

const Layout = tw.div`
  flex flex-col p-6 gap-6
  border border-stone-500/30 rounded-2xl bg-stone-800/50 backdrop-blur-sm

  [&>.content]:flex [&>.content]:flex-col [&>.content]:items-center [&>.content]:pt-1 [&>.content]:gap-2
  [&>.content]:text-stone-200/90 [&>.content]:font-medium 

  [&>.control]:flex [&>.control]:justify-center [&>.control]:w-full [&>.control]:h-10 [&>.control]:px-4 [&>.control]:gap-2
  [&>.control>button]:w-24 [&>.control>button]:rounded-2xl [&>.control>button]:bg-stone-600/30
  [&>.control>button]:border [&>.control>button]:border-stone-200/10 [&>.control>button]:text-stone-200/80
  [&>.control>button]:hover:bg-stone-600/40  [&>.control>button]:hover:border-stone-200/20 [&>.control>button]:hover:text-stone-200/90
  [&>.control>button]:active:bg-stone-600/50 [&>.control>button]:active:border-stone-200/30 [&>.control>button]:active:text-stone-200/95
  [&>.control>button]:focus:bg-stone-600/40 [&>.control>button]:focus:border-stone-200/20 [&>.control>button]:focus:text-stone-200/90
  [&>.control>button]:focus-visible:bg-stone-600/40 [&>.control>button [&>.control>button]:focus-visible:border-stone-200/20 [&>.control>button]:focus-visible:text-stone-200/90

  [&>.control>button.confirm]:bg-indigo-600/50 [&>.control>button.confirm]:border [&>.control>button.confirm]:border-indigo-200/10 [&>.control>button.confirm]:text-indigo-200/80
  [&>.control>button.confirm]:hover:bg-indigo-600/70 [&>.control>button.confirm]:hover:border-indigo-200/20 [&>.control>button.confirm]:hover:text-indigo-200/90
  [&>.control>button.confirm]:active:bg-indigo-600/70 [&>.control>button.confirm]:active:border-indigo-200/30 [&>.control>button.confirm]:active:text-indigo-200/95
  [&>.control>button.confirm]:focus:bg-indigo-600/70 [&>.control>button.confirm]:focus:border-indigo-200/20 [&>.control>button.confirm]:focus:text-indigo-200/90
  [&>.control>button.confirm]:focus-visible:bg-indigo-600/70 [&>.control>button.confirm]:focus-visible:border-indigo-200/20 [&>.control>button.confirm]:focus-visible:text-indigo-200/90

  [&>.control>button]:focus-visible:ring-2 [&>.control>button]:focus-visible:ring-stone-400
  [&>.control>button.confirm]:focus-visible:ring-indigo-400
  [&>.control>button]:transition-colors [&>.control>button]:duration-200
`;

const Alert = ({ message, onConfirm }: { message: SystemMessage; onConfirm: () => void }) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, []);

  return (
    <Layout>
      <div className="content">{message.content}</div>
      <div className="control">
        <button type="button" className="confirm" ref={confirmButtonRef} onClick={onConfirm}>
          확인
        </button>
      </div>
    </Layout>
  );
};

const Confirm = ({
  message,
  onConfirm,
  onCancel,
}: { message: SystemMessage; onConfirm: () => void; onCancel: () => void }) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, []);

  return (
    <Layout>
      <div className="content">{message.content}</div>
      {/* 포커스 처리를 위한 flex-row-reverse */}
      <div className="control flex-row-reverse">
        <button type="button" className="confirm" ref={confirmButtonRef} onClick={onConfirm}>
          확인
        </button>
        <button type="button" ref={cancelButtonRef} onClick={onCancel}>
          취소
        </button>
      </div>
    </Layout>
  );
};

export const ErrorMessageForm = (messages: string[]) => {
  return (
    <ul className="flex flex-col gap-2 list-disc list-inside">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
};
