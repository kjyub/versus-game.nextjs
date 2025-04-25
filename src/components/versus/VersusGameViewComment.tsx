"use client";

import * as VS from "@/styles/VersusStyles";
import { EditStateTypes } from "@/types/DataTypes";
import { Dictionary } from "@/types/common/Dictionary";
import { IPaginationResponse } from "@/types/common/Responses";
import User from "@/types/user/User";
import VersusGame from "@/types/versus/VersusGame";
import VersusGameChoice from "@/types/versus/VersusGameChoice";
import VersusGameComment from "@/types/versus/VersusGameComment";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import StyleUtils from "@/utils/StyleUtils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import VersusCommentPagination from "./VersusCommentPagination";

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
  const session = useSession();
  const [user, setUser] = useState<User>(new User());

  const [choiceDic, setChoiceDic] = useState<Dictionary<string, VersusGameChoice>>(
    new Dictionary<string, VersusGameChoice>()
  );

  const [comments, setComments] = useState<Array<VersusGameComment>>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);

  const [content, setContent] = useState<string>("");
  const [isInputFocus, setInputFocus] = useState<boolean>(false);
  const [isWriteLoading, setWriteLoading] = useState<boolean>(false);

  useEffect(() => {
    getComments(-1);
  }, [isShowResult]);

  useEffect(() => {
    getUser();
  }, [session.status]);

  useEffect(() => {
    // 댓글의 선택지란에 들어갈 데이터를 위해 딕셔너리화 한다.
    const newChoiceDic = new Dictionary<string, VersusGameChoice>();
    game.choices.map((choice: VersusGameChoice) => {
      newChoiceDic.push(choice.id, choice);
    });
    setChoiceDic(newChoiceDic);
  }, [game]);

  const getUser = async () => {
    if (session.status !== "authenticated") {
      return;
    }

    const { result, data } = await ApiUtils.request(`/api/users/user_info/${session.data.user._id}`, "GET");

    if (result) {
      const newUser = new User();
      newUser.parseResponse(data);
      setUser(newUser);
    }
  };

  const getComments = async (_pageIndex: number) => {
    if (CommonUtils.isStringNullOrEmpty(game.nanoId)) {
      return;
    }

    const { result, data } = await ApiUtils.request(`/api/versus/comment/${game.nanoId}`, "GET", {
      gameNanoId: game.nanoId,
      pageIndex: _pageIndex,
      pageSize: PAGE_SIZE,
    });

    if (!result) {
      return;
    }

    const pagination: IPaginationResponse = data;

    let _comments: Array<VersusGameComment> = [];
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
  };

  const handlePageIndex = async (_pageIndex: number) => {
    await getComments(_pageIndex);
  };

  const handleWriteComment = async () => {
    if (isWriteLoading) {
      return;
    }

    setWriteLoading(true);

    let data = {
      parentId: null,
      gameId: game.id,
      gameChoiceId: answerChoice.id,
      content: content,
    };

    const { result, data: responseData } = await ApiUtils.request(`/api/versus/comment`, "POST", null, data);

    if (!result) {
      setWriteLoading(false);
      alert(responseData["message"] ?? "실패했습니다.");
      return;
    }

    setContent("");
    getComments(-1);
    setWriteLoading(false);
  };

  const handleWriteCommentEnter = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleWriteComment();
    }
  };

  const getCurrentComments = useCallback(() => {
    getComments(pageIndex);
  }, [pageIndex]);

  return (
    <VS.GameViewCommentLayout $is_show={isShowResult}>
      <span className="title">의견</span>
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
        <span className="px-1 font-light text-stone-300">내 의견 남기기</span>
        <VS.GameViewCommentInputBox $is_focus={isInputFocus}>
          <div className="px-3 py-1 font-medium rounded-md bg-linear-to-tr from-indigo-700 to-indigo-500 text-white">
            {answerChoice.title}
          </div>
          {/* <div className="px-2 py-1 font-semibold text-indigo-400">
                        {answerChoice.title}
                    </div> */}
          <textarea
            type={"text"}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            onFocus={() => {
              setInputFocus(true);
            }}
            onBlur={() => {
              StyleUtils.rollbackScreen();
              setInputFocus(false);
            }}
            onKeyDown={handleWriteCommentEnter}
            onInput={CommonUtils.setTextareaAutoHeight}
          />
          <VS.GameViewCommentInputButton
            $is_active={!isWriteLoading}
            onClick={() => {
              handleWriteComment();
            }}
          >
            <i className="fa-solid fa-comment text-lg"></i>
          </VS.GameViewCommentInputButton>
        </VS.GameViewCommentInputBox>
      </div>
    </VS.GameViewCommentLayout>
  );
}

interface ICommentBox {
  comment: VersusGameComment;
  choiceDic: Dictionary<string, VersusGameChoice>;
  user: User;
  getCurrentComments: (_pageIndex: number) => void;
}
const CommentBox = ({ comment, choiceDic, user, getCurrentComments }: ICommentBox) => {
  const [choice, setChoice] = useState<VersusGameChoice>(new VersusGameChoice());

  const [editState, setEditState] = useState<EditStateTypes>(EditStateTypes.WAIT);

  const [content, setContent] = useState<string>("");
  const [isInputFocus, setInputFocus] = useState<boolean>(false);
  const [isWriteLoading, setWriteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (choiceDic.contains(comment.gameChoiceId)) {
      setChoice(choiceDic.getValue(comment.gameChoiceId));
    }

    setEditState(EditStateTypes.WAIT);
  }, [comment, choiceDic]);

  const handleEditComment = async () => {
    if (isWriteLoading) {
      return;
    }

    setWriteLoading(true);

    let data = {
      content: content,
    };

    const { result, data: responseData } = await ApiUtils.request(
      `/api/versus/comment/${comment.id}`,
      "PUT",
      null,
      data
    );

    if (!result) {
      setWriteLoading(false);
      alert(responseData["message"] ?? "실패했습니다.");
      return;
    }

    comment.content = content;
    setWriteLoading(false);
    setEditState(EditStateTypes.WAIT);
  };

  const handleWriteCommentEnter = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditComment();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setEditState(EditStateTypes.WAIT);
    }
  };

  const handleEditButton = () => {
    setContent(comment.content);
    if (editState === EditStateTypes.EDITED) {
      setEditState(EditStateTypes.WAIT);
    } else {
      setEditState(EditStateTypes.EDITED);
    }
  };

  const handleDeleteComment = async () => {
    if (isWriteLoading) {
      return;
    }

    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    setWriteLoading(true);

    const { result, data: responseData } = await ApiUtils.request(`/api/versus/comment/${comment.id}`, "DELETE");

    if (!result) {
      setWriteLoading(false);
      alert(responseData["message"] ?? "실패했습니다.");
      return;
    }

    getCurrentComments();
    setWriteLoading(false);
    setEditState(EditStateTypes.WAIT);
  };

  return (
    <VS.GameViewCommentBox>
      <div className="flex items-center w-full mb-3">
        {/* 선택지 */}
        <div className="relative flex flex-center px-4 h-7 rounded-lg overflow-hidden">
          {choice.title}
          <span
            className="absolute z-10 flex flex-center w-full h-full text-white bg-black/20"
            style={{
              textShadow: "-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c",
            }}
          >
            {choice.title}
          </span>
        </div>
        {/* 유저 */}
        <span className="ml-2 text-stone-300 text-sm">{comment.user.name}</span>
        {/* 생성일 */}
        <span className="ml-auto text-stone-400 text-sm">{comment.created}</span>
        {/* 작성자 메뉴 */}
        {user.id === comment.userId && (
          <div className="flex items-center ml-2 space-x-1">
            {/* 수정 */}
            <VS.GameViewCommentEditButton
              $is_active={editState === EditStateTypes.EDITED}
              onClick={() => {
                handleEditButton();
              }}
            >
              <i className="fa-solid fa-pen"></i>
            </VS.GameViewCommentEditButton>
            {/* 삭제 */}
            <VS.GameViewCommentEditButton
              onClick={() => {
                handleDeleteComment();
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </VS.GameViewCommentEditButton>
          </div>
        )}
      </div>

      {/* 내용 */}
      {editState === EditStateTypes.WAIT && <p className="w-full px-0 text-stone-200">{comment.content}</p>}
      {editState === EditStateTypes.EDITED && (
        <VS.GameViewCommentInputBox>
          <textarea
            type={"text"}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            onFocus={() => {
              setInputFocus(true);
            }}
            onBlur={() => {
              StyleUtils.rollbackScreen();
              setInputFocus(false);
            }}
            onKeyDown={handleWriteCommentEnter}
            onInput={CommonUtils.setTextareaAutoHeight}
          />
          <VS.GameViewCommentInputButton
            $is_active={!isWriteLoading}
            onClick={() => {
              handleEditComment();
            }}
          >
            <i className="fa-solid fa-comment text-lg"></i>
          </VS.GameViewCommentInputButton>
        </VS.GameViewCommentInputBox>
      )}
    </VS.GameViewCommentBox>
  );
};
