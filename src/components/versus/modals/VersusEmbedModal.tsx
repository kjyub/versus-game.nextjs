import * as VS from '@/styles/VersusStyles';
import VersusGame from '@/types/versus/VersusGame';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface IVersusEmbedModal {
  gameNanoId: string;
  close: () => void;
}
export default function VersusEmbedModal({ gameNanoId, close }: IVersusEmbedModal) {
  const [source, setSource] = useState<string>('');

  useEffect(() => {
    const url = new URL(`/embed/${gameNanoId}`, process.env.NEXT_PUBLIC_API_URL);
    setSource(`<iframe src="${url}" width="100%" height="600px" frameborder="0"></iframe>`);
  }, [gameNanoId]);

  const iframePreview = useMemo(
    () => (
      <div
        className="max-sm:hidden w-full rounded-lg overflow-hidden my-2"
        dangerouslySetInnerHTML={{ __html: source }}
      />
    ),
    [source],
  );

  return (
    <VS.ShareEmbedModalLayout className="max-sm:w-[80vw] sm:w-[560px]">
      <span className="title">소스 코드 공유</span>

      {/* 미리보기 */}
      {iframePreview}

      {/* 코드 공유 */}
      <SourceCode source={source} />
    </VS.ShareEmbedModalLayout>
  );
}

const SourceCode = ({ source }: { source: string }) => {
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleCopy = useCallback(() => {
    setMessage('소스가 복사되었습니다.');
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="relative flex justify-between w-full overflow-hidden">
        <span className="text-sm text-stone-300">아래 소스코드를 복사하여 사용하세요</span>

        <VS.ShareEmbedModalMessage $is_show={showMessage}>{message}</VS.ShareEmbedModalMessage>
      </div>
      <textarea
        className="w-full max-sm:h-32 sm:h-16 p-2 border border-stone-800/40 resize-none rounded-md layer-bg text-stone-400"
        value={source}
        readOnly
      />
      <CopyToClipboard text={source}>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full p-2 text-stone-200 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          복사하기
        </button>
      </CopyToClipboard>
    </div>
  );
};
