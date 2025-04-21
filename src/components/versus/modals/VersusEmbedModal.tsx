import * as VS from '@/styles/VersusStyles'
import VersusGame from '@/types/versus/VersusGame'
import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

interface IVersusEmbedModal {
  game: VersusGame
  close: () => void
}
export default function VersusEmbedModal({ game, close }: IVersusEmbedModal) {
  const [source, setSource] = useState<string>('')

  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    setSource(
      `<iframe src="https://chooseming.com/embed/${game.nanoId}" width="100%" height="400px" frameborder="0"></iframe>`,
    )
  }, [game])

  const handleCopy = () => {
    setMessage('소스가 복사되었습니다.')
    setShowMessage(true)
    setTimeout(() => {
      setShowMessage(false)
    }, 2000)
  }

  return (
    <VS.ShareEmbedModalLayout className="max-sm:w-[80vw] sm:w-[560px]">
      <span className="title">소스 코드 공유</span>

      {/* 미리보기 */}
      {/* <div className="w-full overflow-hidden"> */}
      {/* </div> */}
      <div className="w-full rounded-lg overflow-hidden my-2" dangerouslySetInnerHTML={{ __html: source }} />

      {/* 코드 공유 */}
      <div className="flex flex-col w-full space-y-2">
        <div className="relative flex justify-between w-full overflow-hidden">
          <span className="text-sm text-stone-300">아래 소스코드를 복사하여 사용하세요</span>

          <VS.ShareEmbedModalMessage $is_show={showMessage}>{message}</VS.ShareEmbedModalMessage>
        </div>
        <textarea
          className="w-full h-16 p-2 border border-stone-800/40 rounded-md bg-black/20 text-stone-400"
          value={source}
          readOnly
        />
        <CopyToClipboard text={source}>
          <button
            onClick={handleCopy}
            className="w-full p-2 text-stone-200 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            복사하기
          </button>
        </CopyToClipboard>
      </div>
    </VS.ShareEmbedModalLayout>
  )
}
