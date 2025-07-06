'use client';
import * as S from '@/styles/VersusStyles';
import VersusGame from '@/types/versus/VersusGame';
import Link from 'next/link';
import VersusGameHead from './VersusGameHead';

interface IVersusGameView {
  gameData: any | null;
}
export default function VersusGameEmbedView({ gameData = null }: IVersusGameView) {
  const game = new VersusGame();
  game.parseResponse(gameData);

  return (
    <S.GameViewLayout>
      <VersusGameHead game={game} isEmbed={true} />

      <div className="grid grid-cols-2 gap-4 w-full p-4">
        {game.choices.map((choice) => (
          <S.GameViewChoiceBox key={choice.id}>
            <div className="check-icon">
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
          className="bg-indigo-600/70 hover:bg-indigo-700/70 text-white backdrop-blur-lg px-6 py-3 rounded-full text-lg font-medium flex items-center justify-center active:translate-y-2 transition-all duration-300"
        >
          투표하러 가기
          <i className="fa-solid fa-arrow-up-right-from-square text-base ml-2"></i>
        </Link>
      </div>
    </S.GameViewLayout>
  );
}
