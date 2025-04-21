'use client'
import * as VS from '@/styles/VersusStyles'
import VersusGame from '@/types/versus/VersusGame'
import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ModalContainer from '../ModalContainer'
import VersusEmbedModal from './modals/VersusEmbedModal'

const PAGE_SIZE = 5

interface IVersusGameHead {
  game: VersusGame
}
export default function VersusGameHead({ game }: IVersusGameHead) {
  return (
    <VS.GameViewHeadLayout>
      <span className="title">{game.title}</span>
      <p className="content">{game.content}</p>

      <div className="flex justify-end items-center w-full">
        <ShareBox game={game} />
      </div>
    </VS.GameViewHeadLayout>
  )
}

const ShareBox = ({ game }: IVersusGameHead) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const [isEmbedModalOpen, setEmbedModalOpen] = useState<boolean>(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setMessage('링크가 복사되었습니다.')
    setShowMessage(true)
    setTimeout(() => {
      setShowMessage(false)
    }, 2000)
  }

  return (
    <VS.ShareBox onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <div className="relative overflow-hidden">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <VS.ShareButton
              onClick={() => {
                setEmbedModalOpen(true)
              }}
            >
              <i className="fa-solid fa-crop-simple"></i>
              <span>소스 코드</span>
            </VS.ShareButton>
            <CopyToClipboard text={window.location.href}>
              <VS.ShareButton
                onClick={() => {
                  handleCopy()
                }}
              >
                <i className="fa-solid fa-link"></i>
                <span>링크 복사</span>
              </VS.ShareButton>
            </CopyToClipboard>
          </div>
        )}
      </div>

      <button className="icon">
        <i className="fa-solid fa-arrow-up-from-bracket text-stone-200"></i>
      </button>

      <VS.ShareMessage $is_show={showMessage}>{message}</VS.ShareMessage>

      <ModalContainer isOpen={isEmbedModalOpen} setIsOpen={setEmbedModalOpen}>
        <VersusEmbedModal
          game={game}
          close={() => {
            setEmbedModalOpen(false)
          }}
        />
      </ModalContainer>
    </VS.ShareBox>
  )
}
