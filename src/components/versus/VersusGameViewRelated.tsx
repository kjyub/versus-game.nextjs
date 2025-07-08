'use client';
import * as VS from '@/styles/VersusStyles';
import User from '@/types/user/User';
import type VersusGame from '@/types/versus/VersusGame';
import CommonUtils from '@/utils/CommonUtils';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import VersusGameBox from './VersusGameBox';
import VersusGameSimpleBox from './VersusGameSimpleBox';
import { GameConsts } from '@/types/VersusTypes';

const PAGE_SIZE = 5;

interface IVersusGameViewRelated {
  game: VersusGame;
  isShowResult: boolean;
  commentHelpBox: ReactNode;
}
export default function VersusGameViewRelated({ game, isShowResult, commentHelpBox }: IVersusGameViewRelated) {
  const router = useRouter();

  const [relatedGames, setRelatedGames] = useState<Array<VersusGame>>([]);

  useEffect(() => {
    setRelatedGames(game.relatedGames.filter((rg) => rg.id !== game.id).slice(0, GameConsts.VISIBLE_RELATED_GAME_COUNT));
  }, [game]);

  return (
    <VS.GameViewRelatedLayout $is_show={isShowResult}>
      <div className="flex justify-between items-center w-full">
        <span className="font-bold text-xl text-stone-800">연관 게임</span>

        {commentHelpBox && commentHelpBox}
      </div>
      <VS.GameViewRelatedList>
        {relatedGames.map((relatedGame: VersusGame, index: number) => (
          <VersusGameSimpleBox key={index} game={relatedGame} />
        ))}
      </VS.GameViewRelatedList>
    </VS.GameViewRelatedLayout>
  );
}
