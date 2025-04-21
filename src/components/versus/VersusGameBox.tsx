'use client'

import * as VS from '@/styles/VersusStyles'
import { CookieConsts } from '@/types/ApiTypes'
import { UserRole } from '@/types/UserTypes'
import { GameState, PrivacyTypeIcons, PrivacyTypeNames } from '@/types/VersusTypes'
import User from '@/types/user/User'
import VersusGame from '@/types/versus/VersusGame'
import ApiUtils from '@/utils/ApiUtils'
import CommonUtils from '@/utils/CommonUtils'
import StorageUtils from '@/utils/StorageUtils'
import Image from 'next/image'
// import VersusMainSearch from "@/components/versus/VersusMainSearch"
import { useState } from 'react'

interface IGameBox {
  game: VersusGame
  user: User
  goLink: (gameId: string) => void
  memoryRawData: (_game: VersusGame) => void
}
export default function VersusGameBox({ game, user, goLink, memoryRawData }: IGameBox) {
  const isMaster = game.userId === user.id
  const [isHover, setHover] = useState<boolean>(false)

  const handleGame = () => {
    StorageUtils.pushSessionStorageList(CookieConsts.GAME_VIEWED_SESSION, game.nanoId)

    if (!CommonUtils.isNullOrUndefined(memoryRawData)) {
      memoryRawData(game)
    }
    goLink(`/game/${game.nanoId}`)
  }

  const handleUpdate = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    goLink(`/game/update/${game.nanoId}`)
  }

  return (
    <VS.ListGameBox
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      className={`${isHover ? 'hover' : ''}`}
      onClick={() => {
        handleGame()
      }}
    >
      <VS.ListGameThumbnailBox>
        {!CommonUtils.isStringNullOrEmpty(game.thumbnailImageUrl) ? (
          <Image
            src={ApiUtils.mediaUrl(game.thumbnailImageUrl)}
            className={`${isHover ? 'hover' : ''}`}
            alt={''}
            fill
          />
        ) : (
          '썸네일이 없습니다.'
        )}
      </VS.ListGameThumbnailBox>
      <VS.ListGameContentBox>
        <span className={`title ${game.isView ? 'viewed' : ''}`}>
          {/* 선택했었는지 여부 */}
          {game.isChoice && (
            <i title={'이미 선택한 게임입니다.'} className="fa-solid fa-circle-check text-indigo-400 mr-1" />
          )}
          {/* 제목 */}
          {game.title}
          {/* 상태 */}
          {game.state === GameState.BLOCK && (
            <span className="ml-auto text-stone-300 text-sm font-normal">관리자에 의한 차단</span>
          )}
        </span>
        <span className="content">{game.content}</span>
      </VS.ListGameContentBox>
      <VS.ListGameControlBox>
        {/* 게임 정보 */}
        <div className="box">
          {(user.userRole === UserRole.STAFF || isMaster) && (
            <VS.ListGamePrivacy>
              {PrivacyTypeIcons[game.privacyType]}
              <span className="value">{PrivacyTypeNames[game.privacyType]}</span>
            </VS.ListGamePrivacy>
          )}
        </div>
        {/* 게임 정보 (글쓴이) */}
        {isMaster && (
          <div className="box">
            <VS.ListGameControlButton onClick={handleUpdate}>수정</VS.ListGameControlButton>
          </div>
        )}
      </VS.ListGameControlBox>
    </VS.ListGameBox>
  )
}
