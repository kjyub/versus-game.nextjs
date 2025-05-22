"use client";
import { useUser } from "@/hooks/useUser";
import * as VS from "@/styles/VersusStyles";
import { CookieConsts } from "@/types/ApiTypes";
import { IListState } from "@/types/CommonTypes";
import { IPaginationResponse } from "@/types/common/Responses";
import VersusGame from "@/types/versus/VersusGame";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import StorageUtils from "@/utils/StorageUtils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import VersusGameBox from "./VersusGameBox";
import Pagination from "@/types/apis/pagination";
import VersusGameBoxCloud from "./VersusGameBoxCloud";

const PAGE_SIZE = 50;

// Api에서 게임 데이터를 게임 객체로 변환
const convertGameDataToGame = (gameData: Array<object>): Array<VersusGame> => {
  // 유저가 게임을 조회, 참여 했는지를 임시로 저장해서 확인한다.
  // 뒤로가기 처럼 다시 리스트 조회 시 매번 api 요청하지 않기 때문에 최적화를 위함.
  const gameViewsCache: Array<string> = StorageUtils.getSessionStorageList(CookieConsts.GAME_VIEWED_SESSION);
  const gameViewsCacheSet: Set<string> = new Set(gameViewsCache);
  const gameChoicesCache: Array<string> = StorageUtils.getSessionStorageList(CookieConsts.GAME_CHOICED_SESSION);
  const gameChoicesCacheSet: Set<string> = new Set(gameChoicesCache);

  let newGames: Array<VersusGame> = gameData.map((data) => {
    const game = new VersusGame();
    game.parseResponse(data);

    if (gameViewsCacheSet.has(game.nanoId)) {
      game.isView = true;
    }
    if (gameChoicesCacheSet.has(game.nanoId)) {
      game.isChoice = true;
    }

    return game;
  });

  return newGames;
};

const handleTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

interface IVersusList {
  versusGameData: IPaginationResponse;
}
export default function VersusList({ versusGameData }: IVersusList) {
  const router = useRouter();

  const user = useUser();

  // 서버렌더링용 초기 데이터 설정
  const initPagination = useMemo(() => {
    const pagination = new Pagination<VersusGame>();
    pagination.parseResponse(versusGameData, VersusGame);
    return pagination;
  }, [versusGameData]);

  // 게임 데이터
  const [games, setGames] = useState<Array<VersusGame>>(initPagination.items);

  // 페이지네이션
  const searchParams = useSearchParams();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [lastId, setLastId] = useState<string>("");
  const [itemCount, setItemCount] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [scrollRef, scrollInView] = useInView();
  const [isScrollLoading, setScrollLoading] = useState<boolean>(false);

  // 무한 스크롤 관련
  const [listState, setListState] = useState<IListState>({});
  const [rollbackScrollLocation, setRollbackScrollLocation] = useState<number>(-1); // 목록으로 되돌아 왔을 때 이동할 스크롤 위치

  useEffect(() => {
    // 맨 위의 아이템이 보이면 업데이트
    if (scrollInView && games.length >= PAGE_SIZE - 3) {
      getNextPage();
    }
  }, [scrollInView]);

  useEffect(() => {
    // 목록으로 되돌아 왔을 때 이동할 스크롤 위치가 있다면 바로 이동한다.
    if (games.length > 0 && rollbackScrollLocation >= 0) {
      const page = document.body;
      if (page) {
        page.scrollTo({
          top: rollbackScrollLocation,
        });
      }
    }
  }, [games, rollbackScrollLocation]);

  useEffect(() => {
    if (rollbackListState()) {
      sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
      return;
    }

    const newGames: Array<VersusGame> = convertGameDataToGame(initPagination.items);

    setGames(newGames);
    setPageIndex(1);
    let _lastId: string = "";
    if (newGames.length > 0) {
      _lastId = newGames[newGames.length - 1].id;
    } else {
      _lastId = "";
    }
    setLastId(_lastId);
    setItemCount(initPagination.count);
    setMaxPage(initPagination.maxPage);

    // 뒤로가기로 돌아왔을 때 사용할 데이터 설정
    updateListState([], _lastId, versusGameData.items);
    // 페이지를 처음 들어온 경우 이전 기억을 지운다.
    sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION);
  }, [versusGameData]);

  const getNextPage = useCallback(async () => {
    if (isScrollLoading) {
      return;
    }

    // 게임들이 이미 한번 이상 로딩되었는데 lastId가 없으면 에러 혹은 페이지 끝이라고 간주
    if (pageIndex > 1 && !lastId) {
      return;
    }

    setScrollLoading(true);

    let params = {
      ...ApiUtils.getParams(searchParams, ["search", "myGames"]),
      lastId: lastId,
      userId: user.id,
    };

    const { result, data } = await ApiUtils.request("/api/versus/game", "GET", { params });

    if (!result) {
      setScrollLoading(false);
      return;
    }

    const pagination: IPaginationResponse = data;
    const items = pagination.items;

    if (pagination.itemCount === 0) {
      setScrollLoading(false);
      return;
    }

    const newGames: Array<VersusGame> = convertGameDataToGame(items);

    setPageIndex(pageIndex + 1);
    setLastId(pagination.lastId);
    setGames([...games, ...newGames]);
    setItemCount(pagination.itemCount);
    setMaxPage(pagination.maxPage);

    // 뒤로가기로 돌아왔을 때 사용할 데이터 설정
    updateListState(listState.items, pagination.lastId, items);

    setScrollLoading(false);
  }, [isScrollLoading, lastId, pageIndex, searchParams, user.id, games, listState]);

  // 뒤로가기로 돌아왔을 때 사용할 데이터 업데이트
  const updateListState = useCallback((rawDataItems: IListState = [], lastId: string, newDataItems: Array<object>) => {
    let scrollLocation = 0;
    const page = document.body;
    if (page) {
      scrollLocation = page.scrollHeight;
    }

    const newRawData: IListState = {
      lastId: lastId,
      items: [...rawDataItems, ...newDataItems],
      scrollLocation: scrollLocation,
    };

    setListState(newRawData);
  }, []);

  // 현재 목록 상태를 세션스토리지에 저장한다.
  const storeListState = useCallback(
    (_game: VersusGame) => {
      let scrollLocation = 0;
      const page = document.body;
      if (page) {
        scrollLocation = page.scrollTop;
      }

      const newRawData: IListState = {
        ...listState,
        scrollLocation: scrollLocation,
      };

      setListState(newRawData);

      const jsonData = JSON.stringify(newRawData);
      sessionStorage.setItem(CookieConsts.GAME_LIST_DATA_SESSION, jsonData);
      StorageUtils.pushSessionStorageList(CookieConsts.GAME_VIEWED_SESSION, _game.nanoId);
    },
    [listState]
  );

  // 리스트 상태를 이전 상태로 되돌린다.
  const rollbackListState = useCallback((): boolean => {
    const jsonData = sessionStorage.getItem(CookieConsts.GAME_LIST_DATA_SESSION);

    if (!jsonData) {
      return false;
    }

    const _rawData: IListState = JSON.parse(jsonData);
    const newGames: Array<VersusGame> = convertGameDataToGame(_rawData.items);

    setGames(newGames);
    setPageIndex(1);
    setLastId(_rawData.lastId);
    setItemCount(0);
    setMaxPage(0);

    // 뒤로가기로 돌아왔을 때 사용할 데이터 설정
    updateListState([], _rawData.lastId, _rawData.items);
    setRollbackScrollLocation(_rawData.scrollLocation);

    return true;
  }, []);

  return (
    <VS.ListLayout>
      <VS.ListGrid>
        {games.map((game: VersusGame, index: number) => (
          <VersusGameBoxCloud key={index} index={index}>
            <VersusGameBox game={game} user={user} storeListState={storeListState} />
          </VersusGameBoxCloud>
        ))}
      </VS.ListGrid>
      <VS.ListGameLoadingBox $is_active={isScrollLoading} ref={scrollRef}></VS.ListGameLoadingBox>
      <VS.ListScrollTopButton
        onClick={() => {
          handleTop();
        }}
      >
        <i className="fa-solid fa-chevron-up"></i>
      </VS.ListScrollTopButton>
    </VS.ListLayout>
  );
}
