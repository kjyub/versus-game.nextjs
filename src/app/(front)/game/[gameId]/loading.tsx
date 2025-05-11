"use client";

import * as S from "@/styles/VersusStyles";
import VersusChoiceView from "@/components/versus/inputs/VersusChoiceView";
import VersusGameHead from "@/components/versus/VersusGameHead";
import VersusGame from "@/types/versus/VersusGame";
import VersusGameChoice from "@/types/versus/VersusGameChoice";

export default function Loading() {
  const game = new VersusGame();
  const choices = Array.from({ length: 4 }, () => new VersusGameChoice());

  return (
    <S.GameViewLayout className="[&>div]:animate-pulse">
      <VersusGameHead game={game} />

      <S.GameViewChoiceLayout>
        <VersusChoiceView
          game={game}
          choices={choices}
          selectChoice={() => {}}
          selectedChoice={new VersusGameChoice()}
          isShowResult={false}
        />
      </S.GameViewChoiceLayout>

      <S.GameViewSelectLayout>
        <button className="max-sm:w-20 sm:w-28 bg-stone-500/50 hover:bg-stone-600/50" disabled={true}></button>
        <button className="grow bg-indigo-600/70 hover:bg-indigo-700/70" disabled={true}></button>
      </S.GameViewSelectLayout>
    </S.GameViewLayout>
  );
}
