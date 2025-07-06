'use client';
import * as S from '@/styles/VersusStyles';
import VersusGame from '@/types/versus/VersusGame';
import VersusGameChoice from '@/types/versus/VersusGameChoice';
import Link from 'next/link';
import VersusGameHead from './VersusGameHead';
import { cn } from '@/utils/StyleUtils';
import { useMemo, useState } from 'react';
import { ChoiceSelectStatus } from '@/types/VersusTypes';

interface IVersusGameView {
  gameData: any | null;
}
export default function VersusGameEmbedView({ gameData = null }: IVersusGameView) {
  const [selectedChoice, setSelectedChoice] = useState<VersusGameChoice>(new VersusGameChoice());

  const game = useMemo(() => {
    const game = new VersusGame();
    game.parseResponse(gameData);
    return game;
  }, [gameData]);

  return (
    <S.GameViewLayout>
      <VersusGameHead game={game} isEmbed={true} />

      <div className="grid grid-cols-2 gap-4 w-full p-4">
        {game.choices.map((choice) => (
          <S.GameViewChoiceBox
            key={choice.id}
            className="cursor-pointer"
            onClick={() => setSelectedChoice(selectedChoice.id === choice.id ? new VersusGameChoice() : choice)}
            $status={selectedChoice.id ? (selectedChoice.id === choice.id ? ChoiceSelectStatus.SELECTED : ChoiceSelectStatus.UNSELECTED) : ChoiceSelectStatus.WAIT}
          >
            <div className={cn(['check-icon', { active: selectedChoice.id === choice.id }])}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <span
              className="title"
              style={{
                textShadow: '-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c',
              }}
            >
              {choice.title}
            </span>
          </S.GameViewChoiceBox>
        ))}
      </div>

      <div className="fixed bottom-4 flex justify-center w-full">
        <Link
          href={`/game/${game.nanoId}`}
          target="_blank"
          className={cn([
            'flex items-center justify-center px-6 py-3',
            'rounded-full backdrop-blur-lg bg-indigo-600/70 hover:bg-indigo-700/70',
            'text-white text-lg font-medium',
            'mouse:hover:scale-105 active:translate-y-2 transition-all duration-300',
          ])}
        >
          투표하러 가기
          <i className="fa-solid fa-arrow-up-right-from-square text-base ml-2"></i>
        </Link>
      </div>
    </S.GameViewLayout>
  );
}
