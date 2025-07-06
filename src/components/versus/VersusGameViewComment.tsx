'use client';

import { useUser } from '@/hooks/useUser';
import * as VS from '@/styles/VersusStyles';
import { Dictionary } from '@/types/common/Dictionary';
import type { IPaginationResponse } from '@/types/common/Responses';
import type VersusGame from '@/types/versus/VersusGame';
import type VersusGameChoice from '@/types/versus/VersusGameChoice';
import VersusGameComment from '@/types/versus/VersusGameComment';
import ApiUtils from '@/utils/ApiUtils';
import CommonUtils from '@/utils/CommonUtils';
import type React from 'react';
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react';
import CommentBox from './CommentBox';
import VersusCommentPagination from './VersusCommentPagination';
import useToastMessageStore from '@/stores/zustands/useToastMessageStore';

const PAGE_SIZE = 5;

interface IVersusGameViewComment {
  game: VersusGame;
  answerChoice: VersusGameChoice;
  isShowResult: boolean;
  setCommentCount: Dispatch<SetStateAction<number>>;
}
export default function VersusGameViewComment({
  game,
  answerChoice,
  isShowResult,
  setCommentCount,
}: IVersusGameViewComment) {
  const user = useUser();

  const [choiceDic, setChoiceDic] = useState<Dictionary<string, VersusGameChoice>>(
    new Dictionary<string, VersusGameChoice>(),
  );

  const [comments, setComments] = useState<Array<VersusGameComment>>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);

  useEffect(() => {
    getComments(-1);
  }, [isShowResult]);

  useEffect(() => {
    // 댓글의 선택지란에 들어갈 데이터를 위해 딕셔너리화 한다.
    const newChoiceDic = new Dictionary<string, VersusGameChoice>();
    game.choices.map((choice: VersusGameChoice) => {
      newChoiceDic.push(choice.id, choice);
    });
    setChoiceDic(newChoiceDic);
  }, [game]);

  const getComments = useCallback(
    async (_pageIndex: number) => {
      if (!game.nanoId) {
        return;
      }

      const { result, data } = await ApiUtils.request('/api/versus/comment', 'GET', {
        params: {
          gameNanoId: game.nanoId,
          pageIndex: _pageIndex,
          pageSize: PAGE_SIZE,
        },
      });

      if (!result) {
        return;
      }

      const pagination: IPaginationResponse = data;

      const _comments: Array<VersusGameComment> = [];
      pagination.items.map((item) => {
        const newComment = new VersusGameComment();
        newComment.parseResponse(item);
        _comments.push(newComment);
      });
      setComments(_comments);

      setPageIndex(pagination.pageIndex);
      setItemCount(pagination.itemCount);
      setMaxPage(pagination.maxPage);

      setCommentCount(pagination.itemCount);
    },
    [game],
  );

  const handlePageIndex = useCallback(
    async (_pageIndex: number) => {
      await getComments(_pageIndex);
    },
    [getComments],
  );

  const getCurrentComments = useCallback(() => {
    getComments(pageIndex);
  }, [pageIndex, getComments]);

  return (
    <VS.GameViewCommentLayout $is_show={isShowResult}>
      <h4 className="title">댓글</h4>
      <VS.GameViewCommentList>
        {comments.map((comment: VersusGameComment, index: number) => (
          <CommentBox
            key={index}
            comment={comment}
            choiceDic={choiceDic}
            user={user}
            getCurrentComments={getCurrentComments}
          />
        ))}
      </VS.GameViewCommentList>

      <div className="flex justify-center w-full">
        <VersusCommentPagination
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          maxPage={maxPage}
          maxPageButtons={5}
          itemCount={itemCount}
          setPageIndex={handlePageIndex}
        />
      </div>

      <div className="flex flex-col space-y-2">
        {/* <span className="px-1 font-normal text-stone-300">내 의견 남기기</span> */}
        <CommentInputBox game={game} answerChoice={answerChoice} getComments={getComments} />
      </div>
    </VS.GameViewCommentLayout>
  );
}

interface ICommentInputBox {
  game: VersusGame;
  answerChoice: VersusGameChoice;
  getComments: (_pageIndex: number) => Promise<void>;
}
const CommentInputBox = ({ game, answerChoice, getComments }: ICommentInputBox) => {
  const [content, setContent] = useState<string>('');
  const [isInputFocus, setInputFocus] = useState<boolean>(false);
  const [isWriteLoading, setWriteLoading] = useState<boolean>(false);

  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  const handleWriteComment = async () => {
    if (isWriteLoading) {
      return;
    }

    setWriteLoading(true);

    const data = {
      parentId: null,
      gameId: game.id,
      gameChoiceId: answerChoice.id,
      content: content,
    };

    const { result, data: responseData } = await ApiUtils.request('/api/versus/comment', 'POST', { data });

    if (!result) {
      setWriteLoading(false);
      createToastMessage(responseData.message ?? '실패했습니다.');
      return;
    }

    setContent('');
    getComments(-1);
    setWriteLoading(false);
  };

  const handleWriteCommentEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleWriteComment();
    }
  };

  return (
    <VS.GameViewCommentInputBox $is_focus={isInputFocus}>
      <div className="flex items-start w-full gap-1">
        {/* 선택지 */}
        <div className="relative flex flex-center px-4 h-7 rounded-lg text-sm overflow-hidden">
          <span className="text-transparent">{answerChoice.title}</span>
          <span
            className="absolute z-10 flex flex-center w-full h-full text-white layer-bg"
            style={{
              textShadow: '-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c',
            }}
          >
            {answerChoice.title}
          </span>
        </div>
        <div className="max-sm:hidden flex-1">
          <textarea
            style={{ height: '50px' }}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            onKeyDown={handleWriteCommentEnter}
            onInput={CommonUtils.setTextareaAutoHeight}
            placeholder="댓글을 입력해주세요."
          />
        </div>
        <VS.GameViewCommentInputButton
          className="ml-auto"
          $is_active={!isWriteLoading}
          onClick={() => {
            handleWriteComment();
          }}
        >
          <i className="fa-solid fa-comment text-lg"></i>
        </VS.GameViewCommentInputButton>
      </div>
      <div className="max-sm:block sm:hidden w-full">
        <textarea
          style={{ height: '50px' }}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          onKeyDown={handleWriteCommentEnter}
          onInput={CommonUtils.setTextareaAutoHeight}
          placeholder="댓글을 입력해주세요."
        />
      </div>
    </VS.GameViewCommentInputBox>
  );
};
