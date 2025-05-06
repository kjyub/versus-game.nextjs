import * as VS from "@/styles/VersusStyles";
import { Dictionary } from "@/types/common/Dictionary";
import { EditStateTypes } from "@/types/DataTypes";
import VersusGameChoice from "@/types/versus/VersusGameChoice";
import VersusGameComment from "@/types/versus/VersusGameComment";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import StyleUtils from "@/utils/StyleUtils";
import { useEffect, useState } from "react";

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

    const { result, data: responseData } = await ApiUtils.request(`/api/versus/comment/${comment.id}`, "PUT", { data });

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
            style={{ height: "50px" }}
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

export default CommentBox;
