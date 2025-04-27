"use client";

import { useUser } from "@/hooks/useUser";
import * as VS from "@/styles/VersusStyles";
import { CookieConsts } from "@/types/ApiTypes";
import { GameState } from "@/types/VersusTypes";
import VersusGame from "@/types/versus/VersusGame";
import StorageUtils from "@/utils/StorageUtils";
import Link from "next/link";
import { useState } from "react";

interface IGameBox {
  game: VersusGame;
  storeListState?: (_game: VersusGame) => void;
}
export default function VersusGameSimpleBox({ game, storeListState }: IGameBox) {
  const user = useUser();
  const isMaster = game.userId !== user.id;

  const handleGame = () => {
    if (storeListState) {
      storeListState(game);
    }
  };

  return (
    <VS.ListGameSimpleBox onClick={handleGame}>
      <VS.ListGameSimpleContentBox>
        <Link href={`/game/${game.nanoId}`} onClick={handleGame}>
          <VS.ListGameContentBox>
            <span className={`title ${game.isView ? "viewed" : ""}`}>
              {/* 선택했었는지 여부 */}
              {game.isChoice && (
                <i title={"이미 선택한 게임입니다."} className="fa-solid fa-circle-check text-indigo-400 mr-1" />
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
        </Link>
      </VS.ListGameSimpleContentBox>
    </VS.ListGameSimpleBox>
  );
}
