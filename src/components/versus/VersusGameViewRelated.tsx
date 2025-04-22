"use client";
import * as VS from "@/styles/VersusStyles";
import User from "@/types/user/User";
import VersusGame from "@/types/versus/VersusGame";
import CommonUtils from "@/utils/CommonUtils";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import VersusGameBox from "./VersusGameBox";
import VersusGameSimpleBox from "./VersusGameSimpleBox";

const PAGE_SIZE = 5;

interface IVersusGameViewRelated {
  game: VersusGame;
  user: User;
  isShowResult: boolean;
  commentHelpBox: ReactNode;
}
export default function VersusGameViewRelated({ game, user, isShowResult, commentHelpBox }: IVersusGameViewRelated) {
  const router = useRouter();

  const [relatedGames, setRelatedGames] = useState<Array<VersusGame>>([]);

  useEffect(() => {
    setRelatedGames(game.relatedGames.filter((rg) => rg.id !== game.id));
  }, [game]);

  const handleLink = (link: string) => {
    router.push(link);
  };

  return (
    <VS.GameViewRelatedLayout $is_show={isShowResult}>
      <div className="flex justify-between items-center w-full">
        <span className="font-bold text-xl text-stone-800">연관 게임</span>

        {!CommonUtils.isNullOrUndefined(commentHelpBox) && commentHelpBox}
      </div>
      <VS.GameViewRelatedList>
        {relatedGames.map((relatedGame: VersusGame, index: number) => (
          <div key={index}>
            <div className="max-sm:hidden sm:block">
              <VersusGameBox game={relatedGame} user={user} goLink={handleLink} />
            </div>
            <div className="max-sm:block sm:hidden">
              <VersusGameSimpleBox game={relatedGame} user={user} goLink={handleLink} />
            </div>
          </div>
        ))}
      </VS.GameViewRelatedList>
    </VS.GameViewRelatedLayout>
  );
}
