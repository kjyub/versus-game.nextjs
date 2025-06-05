'use client';

import { usePreventLeave } from '@/hooks/usePreventLeave';
import * as S from '@/styles/VersusStyles';
import { CookieConsts } from '@/types/ApiTypes';
import { TextFormats } from '@/types/CommonTypes';
import { Dictionary } from '@/types/common/Dictionary';
import VersusGame from '@/types/versus/VersusGame';
import VersusGameChoice from '@/types/versus/VersusGameChoice';
import ApiUtils from '@/utils/ApiUtils';
import CommonUtils from '@/utils/CommonUtils';
import StorageUtils from '@/utils/StorageUtils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import VersusGameHead from './VersusGameHead';
import VersusGameViewComment from './VersusGameViewComment';
import VersusGameViewRelated from './VersusGameViewRelated';
import VersusChoiceView from './inputs/VersusChoiceView';

interface IVersusGameView {
  gameData?: any;
  userChoiceData?: any;
}
export default function VersusGameView({ gameData, userChoiceData }: IVersusGameView) {
  const router = useRouter();
  const session = useSession();

  const game = new VersusGame();
  game.parseResponse(gameData);
  const [choices, setChoices] = useState<Array<VersusGameChoice>>(game.choices);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  // 선택할 예정인 선택지
  const [selectedChoice, setSelectedChoice] = useState<VersusGameChoice>(new VersusGameChoice());

  // 선택 확정한 선택지
  const [answerChoice, setAnswerChoice] = useState<VersusGameChoice>(new VersusGameChoice());

  const [isShowResult, setShowResult] = useState<boolean>(false);

  const [isMyAnswerLoading, setMyAnswerLoading] = useState<boolean>(true);

  const commentBoxRef = useRef<HTMLDivElement>(null);
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    updateUserChoice();
  }, [userChoiceData, session.status, session]);

  useEffect(() => {
    if (isShowResult) {
      getAnswerResults();
    }
  }, [isShowResult]);

  // 유저가 선택한 데이터 세팅
  const updateUserChoice = async () => {
    // 세션 불러오는 중에는 넘어가기
    if (!session || session.status === 'loading') {
      return;
    }

    setMyAnswerLoading(true);

    // 유저가 선택한 선택지가 있는지 불러온다.
    let isChoice = false;
    if (userChoiceData !== null) {
      const answerId = userChoiceData.gameChoiceId;
      const answer = new VersusGameChoice();

      for (let i = 0; i < game.choices.length; i++) {
        const _choice: VersusGameChoice = game.choices[i];

        // 선택한 선택지가 있으면 게임 결과 표시
        if (_choice.id === answerId) {
          isChoice = true;
          setSelectedChoice(_choice);
          setAnswerChoice(_choice);
          break;
        }
      }
    }

    if (isChoice) {
      setShowResult(true);
    } else {
      setShowResult(false);
      setSelectedChoice(new VersusGameChoice());
      setAnswerChoice(new VersusGameChoice());
    }

    setMyAnswerLoading(false);
  };

  const getAnswerResults = async () => {
    const { result, data: responseData } = await ApiUtils.request('/api/versus/game_choice', 'GET', {
      params: {
        gameNanoId: game.nanoId,
      },
    });

    if (!result) {
      return;
    }

    // 데이터 정리
    const totalDatas: Array<object> = responseData.totalCount ?? [];
    if (totalDatas.length === 0) {
      return;
    }
    const totalData: any = totalDatas[0];
    const _totalVotes = totalData.total ?? 0;
    const choicesData: Array<object> = responseData.choices ?? [];
    if (choicesData.length === 0 || _totalVotes === 0) {
      return;
    }

    setTotalVotes(_totalVotes);
    const choiceDic: Dictionary<string, number> = new Dictionary<string, number>();
    choicesData.map((choiceData: any) => {
      choiceDic.push(choiceData._id ?? '', choiceData.count ?? 0);
    });

    // 선택지 결과 계산 및 값 설정
    const _choices = choices.map((_choice) => {
      if (choiceDic.contains(_choice.id)) {
        _choice.voteCount = choiceDic.getValue(_choice.id);
        _choice.voteRate = (_choice.voteCount / _totalVotes) * 100;
      }

      return _choice;
    });
    setChoices(_choices);
  };

  const handleSelectChoice = (choice: VersusGameChoice) => {
    if (isShowResult) {
      return;
    }

    if (selectedChoice.id === choice.id) {
      setSelectedChoice(new VersusGameChoice());
    } else {
      setSelectedChoice(choice);
    }
  };

  const handleAnswer = async () => {
    if (isMyAnswerLoading) return;

    if (!selectedChoice.id) {
      alert('선택지를 선택해주세요.');
      return;
    }

    setMyAnswerLoading(true);

    const data = {
      gameId: game.id,
      gameAnswerId: selectedChoice.id,
    };

    const { result, data: responseData } = await ApiUtils.request('/api/versus/game_choice', 'POST', { data });
    setMyAnswerLoading(false);

    if (result) {
      setAnswerChoice(selectedChoice);
      setShowResult(true);

      StorageUtils.pushSessionStorageList(CookieConsts.GAME_CHOICED_SESSION, game.nanoId);
    } else {
      alert(responseData.message ?? '요청 실패했습니다.');
    }
  };
  const handleReset = () => {
    if (isShowResult) {
      // 이미 선택을 한 경우
      if (!confirm('선택을 취소하시겠습니까?')) {
        return;
      }

      setAnswerChoice(new VersusGameChoice());
      setSelectedChoice(new VersusGameChoice());
      setShowResult(false);
    } else {
      // 처음 선택하는 경우
      setSelectedChoice(new VersusGameChoice());
    }
  };

  const handleCommentMove = () => {
    if (!commentBoxRef.current) {
      return;
    }

    commentBoxRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <S.GameViewLayout>
      <VersusGameHead game={game} />

      <S.GameViewChoiceLayout>
        <VersusChoiceView
          game={game}
          choices={choices}
          selectChoice={handleSelectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      </S.GameViewChoiceLayout>

      <S.GameViewSelectLayout className={`${isMyAnswerLoading ? 'animate-pulse' : ''}`}>
        <button
          className="max-sm:w-20 sm:w-28 bg-stone-500/50 hover:bg-stone-600/50"
          type="button"
          onClick={() => {
            handleReset();
          }}
          disabled={isMyAnswerLoading}
        >
          초기화
        </button>
        <button
          className="grow bg-indigo-600/70 hover:bg-indigo-700/70"
          type="button"
          onClick={() => {
            handleAnswer();
          }}
          disabled={isMyAnswerLoading || isShowResult}
        >
          선택하고 결과 보기
        </button>
      </S.GameViewSelectLayout>

      <VersusGameViewRelated
        game={game}
        isShowResult={game.relatedGames.length > 0 && isShowResult}
        commentHelpBox={
          <div
            onClick={() => {
              handleCommentMove();
            }}
            className="sm:hidden max-sm:flex items-center px-4 py-2 rounded-full layer-bg-2 text-stone-300 text-sm"
          >
            <i className="fa-solid fa-comment mr-1"></i>
            의견
            <span className="ml-1 text-stone-200">{CommonUtils.textFormat(commentCount, TextFormats.NUMBER)}</span>
          </div>
        }
      />

      <div ref={commentBoxRef} className="w-full">
        <VersusGameViewComment
          game={game}
          answerChoice={answerChoice}
          isShowResult={isShowResult}
          setCommentCount={setCommentCount}
        />
      </div>
    </S.GameViewLayout>
  );
}
