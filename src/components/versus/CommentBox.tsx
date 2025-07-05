import * as VS from '@/styles/VersusStyles';
import { EditStateTypes } from '@/types/DataTypes';
import type { Dictionary } from '@/types/common/Dictionary';
import type User from '@/types/user/User';
import VersusGameChoice from '@/types/versus/VersusGameChoice';
import type VersusGameComment from '@/types/versus/VersusGameComment';
import useToastMessageStore from '@/stores/zustands/useToastMessageStore';
import useSystemMessageStore from '@/stores/zustands/useSystemMessageStore';
import ApiUtils from '@/utils/ApiUtils';
import CommonUtils from '@/utils/CommonUtils';
import { useEffect, useRef, useState } from 'react';

interface ICommentBox {
  comment: VersusGameComment;
  choiceDic: Dictionary<string, VersusGameChoice>;
  user: User;
  getCurrentComments: () => void;
}
const CommentBox = ({ comment, choiceDic, user, getCurrentComments }: ICommentBox) => {
  const [choice, setChoice] = useState<VersusGameChoice>(new VersusGameChoice());

  const [editState, setEditState] = useState<EditStateTypes>(EditStateTypes.WAIT);

  const [content, setContent] = useState<string>('');
  const [isInputFocus, setInputFocus] = useState<boolean>(false);
  const [isWriteLoading, setWriteLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createToastMessage = useToastMessageStore((state) => state.createMessage);
  const createSystemMessage = useSystemMessageStore((state) => state.createMessage);

  useEffect(() => {
    if (choiceDic.contains(comment.gameChoiceId)) {
      setChoice(choiceDic.getValue(comment.gameChoiceId));
    }

    setEditState(EditStateTypes.WAIT);
  }, [comment, choiceDic]);

  useEffect(() => {
    if (editState === EditStateTypes.EDITED && textareaRef.current) {
      CommonUtils.setTextareaAutoHeight({ target: textareaRef.current });
    }
  }, [editState]);

  const handleEditComment = async () => {
    if (isWriteLoading) {
      return;
    }

    setWriteLoading(true);

    const data = {
      content: content,
    };

    const { result, data: responseData } = await ApiUtils.request(`/api/versus/comment/${comment.id}`, 'PUT', { data });

    if (!result) {
      setWriteLoading(false);
      createToastMessage(responseData.message ?? '실패했습니다.');
      return;
    }

    comment.content = content;
    setWriteLoading(false);
    setEditState(EditStateTypes.WAIT);
  };

  const handleWriteCommentEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditComment();
    }
    if (e.key === 'Escape') {
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

    if (!(await createSystemMessage({
        type: 'confirm',
        content: '댓글을 삭제하시겠습니까?',
      }))
    ) {
      return;
    }

    setWriteLoading(true);

    const { result, data: responseData } = await ApiUtils.request(`/api/versus/comment/${comment.id}`, 'DELETE');

    if (!result) {
      setWriteLoading(false);
      createToastMessage(responseData.message ?? '실패했습니다.');
      return;
    }

    getCurrentComments();
    setWriteLoading(false);
    setEditState(EditStateTypes.WAIT);
  };

  return (
    <VS.GameViewCommentBox>
      <div className="flex items-center w-full">
        {/* 선택지 */}
        <div className="relative flex flex-center px-4 h-7 rounded-lg text-sm overflow-hidden">
          {choice.title}
          <span
            className="absolute z-10 flex flex-center w-full h-full text-white layer-bg"
            style={{
              textShadow: '-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c',
            }}
          >
            {choice.title}
          </span>
        </div>
        {/* 유저 */}
        <span className="ml-2 text-stone-200 text-sm">{comment.user.name}</span>
        {/* 생성일 */}
        <span className="ml-auto text-stone-200 text-sm">{comment.created}</span>
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
      {editState === EditStateTypes.WAIT && <pre className="w-full px-0 text-stone-200">{comment.content}</pre>}
      {editState === EditStateTypes.EDITED && (
        <VS.GameViewCommentInputBox className="flex-row">
          <textarea
            ref={textareaRef}
            style={{ height: '50px' }}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
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
