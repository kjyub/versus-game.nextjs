'use client';

import { useUser } from '@/hooks/useUser';
import * as VS from '@/styles/VersusStyles';
import { UserRole } from '@/types/UserTypes';
import { GameState, PrivacyTypeIcons, PrivacyTypeNames } from '@/types/VersusTypes';
import type VersusGame from '@/types/versus/VersusGame';
import type VersusGameChoice from '@/types/versus/VersusGameChoice';
import CommonUtils from '@/utils/CommonUtils';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface IGameBox {
  game: VersusGame;
  storeListState?: (_game: VersusGame) => void;
}
export default function VersusGameBox({ game, storeListState }: IGameBox) {
  const user = useUser();
  const isMaster = game.userId === user.id;
  const hasImage = false;

  const handleGame = () => {
    if (storeListState) {
      storeListState(game);
    }
  };

  return (
    <VS.ListGameBox>
      <Link href={`/game/${game.nanoId}`} onClick={handleGame}>
        <VS.ListGameContentBox>
          {/* title */}
          <h3 className={`title ${game.isView ? 'viewed' : ''}`}>
            {/* 선택했었는지 여부 */}
            {game.isChoice && (
              <i title={'이미 선택한 게임입니다.'} className="fa-solid fa-circle-check text-indigo-400 mr-1" />
            )}
            {/* 제목 */}
            <span className="truncate">
              {game.title}
            </span>
            {/* 상태 */}
            {game.state === GameState.BLOCK && (
              <span className="ml-auto text-stone-300 text-sm font-normal">관리자에 의한 차단</span>
            )}
          </h3>
          {/* content */}
          <pre className="content">{game.content}</pre>
        </VS.ListGameContentBox>
        <Choices choices={game.choices} />
      </Link>
      {(user.userRole === UserRole.STAFF || isMaster) && (
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
            <Link href={`/game/update/${game.nanoId}`} className="box">
              <VS.ListGameControlButton>수정</VS.ListGameControlButton>
            </Link>
          )}
        </VS.ListGameControlBox>
      )}
    </VS.ListGameBox>
  );
}

const Choices = ({ choices }: { choices: VersusGameChoice[] }) => {
  const [isLeftMask, setLeftMask] = useState<boolean>(false);
  const [isRightMask, setRightMask] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e?: Event) => {
      let scrollLeft = 0;
      if (e) {
        const target = e?.target as HTMLDivElement;
        scrollLeft = target.scrollLeft;
      }

      setLeftMask(scrollLeft > 0);

      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const listWidth = listRef.current?.scrollWidth ?? 0;
      const isListOver = containerWidth < listWidth;
      const isRightEnd = Math.ceil(scrollLeft) >= listWidth - containerWidth;
      setRightMask(isListOver && !isRightEnd);
    };
    const debouncedHandleScroll = CommonUtils.debounce(handleScroll, 100);
    handleScroll();

    listRef.current?.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', debouncedHandleScroll);

    return () => {
      listRef.current?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', debouncedHandleScroll);
    };
  }, []);

  if (choices.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <VS.ListGameChoiceBox ref={listRef}>
        {choices
          .filter((choice) => choice.title)
          .map((choice, index) => (
            <div className="box" key={choice.id}>
              <span className="index">{index + 1}.</span>
              {choice.title}
            </div>
          ))}
      </VS.ListGameChoiceBox>

      <VS.ListGameChoiceMask $is_show={isLeftMask} className="left-0" />
      <VS.ListGameChoiceMask $is_show={isRightMask} className="right-0 rotate-180" />
    </div>
  );
};
