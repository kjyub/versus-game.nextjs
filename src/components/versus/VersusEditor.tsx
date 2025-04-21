"use client";
import * as VS from "@/styles/VersusStyles";
import {
  CHOICE_COUNT_CONST,
  GameState,
  PrivacyTypeIcons,
  PrivacyTypeNames,
  PrivacyTypes,
  ThumbnailImageTypes,
} from "@/types/VersusTypes";
import VersusFile from "@/types/file/VersusFile";
import VersusGame from "@/types/versus/VersusGame";
import VersusGameChoice from "@/types/versus/VersusGameChoice";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import StyleUtils from "@/utils/StyleUtils";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalContainer from "../ModalContainer";
import VersusChoiceEdit from "./inputs/VersusChoiceEdit";
import { VersusInputText, VersusInputTextArea } from "./inputs/VersusInputs";
import VersusThumbnailImageEdit from "./inputs/VersusThumbnailImageEdit";
import VersusPrivacyModal from "./modals/VersusPrivacyModal";
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(() => import("@/components/versus/VersusMainSearch"), { ssr: false });

interface IVersusEditor {
  isUpdate: boolean;
  gameData: object | null;
  saveOnClose: () => void | null;
}
export default function VersusEditor({ isUpdate = false, gameData = null, saveOnClose = null }: IVersusEditor) {
  const router = useRouter();
  const session = useSession();

  const [game, setGame] = useState<VersusGame>(new VersusGame());

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [privacyType, setPrivacyType] = useState<PrivacyTypes>(PrivacyTypes.PUBLIC);
  const [choiceCountType, setChoiceCountType] = useState<number>(200); // 백자리 수 부턴 선택 개수, 십자리 수 까진 개수별 레이아웃

  const [isShowPrivacy, setShowPrivacy] = useState<boolean>(false);

  useEffect(() => {
    // const handleBeforeUnload = (event) => {
    //     event.preventDefault()
    //     event.returnValue = "" // 이 줄은 일부 브라우저에서 필수입니다.
    // }
    // window.addEventListener("beforeunload", handleBeforeUnload)
    // window.addEventListener("popstate", handleBeforeUnload)
    // return () => {
    //     window.removeEventListener("beforeunload", handleBeforeUnload)
    //     window.removeEventListener("popstate", handleBeforeUnload)
    // }
    StyleUtils.rollbackScreen();
  }, []);

  useEffect(() => {
    updateGameInit(gameData);
  }, [isUpdate, gameData, session.status]);

  useEffect(() => {
    game.title = title;
  }, [title]);

  useEffect(() => {
    game.content = content;
  }, [content]);

  useEffect(() => {
    game.privacyType = privacyType;
  }, [privacyType]);

  // 업데이트 모드 시 불러온 게임 데이터를 이용해 초기화
  const updateGameInit = (data: object) => {
    // 세션 불러오는 중에는 넘어가기
    if (CommonUtils.isNullOrUndefined(session) || session.status === "loading") {
      return;
    }
    // 로그인 안했으면 나가기
    if (session.status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (!isUpdate || CommonUtils.isNullOrUndefined(data)) {
      return;
    }

    const _game = new VersusGame();
    _game.parseResponse(data);

    if (CommonUtils.isStringNullOrEmpty(_game.id)) {
      alert("데이터가 잘못되었습니다");
      return;
    }

    // 작성자가 아니면 권한 X
    if (isUpdate && session.data?.user?._id !== _game.userId) {
      alert("권한이 없습니다");
      router.push("/");
      return;
    }

    setGame(_game);
    setTitle(_game.title);
    setContent(_game.content);
    setChoiceCountType(_game.choiceCountType);
    setPrivacyType(_game.privacyType);

    // 게임이 차단된 경우
    if (_game.state === GameState.BLOCK) {
      alert("관리자에 의해 게임이 차단되었습니다.\n적절한 내용으로 다시 등록해 주세요.");
    }
  };

  const updateThumbnail = (file: VersusFile) => {
    game.thumbnailImageId = file.id;
    game.thumbnailImageUrl = file.url;
  };

  const updateChoice = (index: number, choice: VersusGameChoice) => {
    game.updateChoice(index, choice);
  };

  // 게임 저장 유효성 검사
  const gameValidate = () => {
    let errorMessages: Array<string> = [];
    // 1. 제목 확인 (필수)
    if (CommonUtils.isStringNullOrEmpty(game.title)) {
      errorMessages.push("제목을 입력해 주세요.");
    }

    // 2. 썸네일 확인 (아직은 선택)

    // 3. 선택지 확인 (선택지의 제목은 반드시 입력되어야 함)
    let choiceCount = Math.floor(choiceCountType / CHOICE_COUNT_CONST);
    for (let i = 0; i < choiceCount; i++) {
      const choice: VersusGameChoice = game.choices[i];

      if (CommonUtils.isStringNullOrEmpty(choice.title)) {
        errorMessages.push(`${i + 1}번 선택지의 제목을 입력해주세요`);
      }
    }

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));

      return false;
    }

    return true;
  };

  const handleSave = async () => {
    // 유효성 검사
    if (!gameValidate()) {
      return;
    }

    const data = {
      title: game.title,
      content: game.content,
      thumbnailImageId: game.thumbnailImageId,
      privacyType: game.privacyType,
      choices: game.choices.map((_c) => _c.parseRequest()),
      choiceCountType: choiceCountType,
    };

    // 저장 성공 여부
    let saveResult: boolean = false;

    if (CommonUtils.isStringNullOrEmpty(game.id)) {
      const [bResult, statusCode, response] = await ApiUtils.request("/api/versus/game", "POST", null, data);

      if (!bResult) {
        if (response["message"]) {
          alert(response["message"]);
        } else {
          alert("저장 실패했습니다.");
        }

        return;
      }

      const newGame = new VersusGame();
      newGame.parseResponse(response);

      if (!newGame.isEmpty()) {
        saveResult = true;
      }
    } else {
      const [bResult, statusCode, response] = await ApiUtils.request(
        `/api/versus/game/${game.nanoId}`,
        "PUT",
        null,
        data
      );

      if (!bResult) {
        if (response["message"]) {
          alert(response["message"]);
        } else {
          alert("저장 실패했습니다.");
        }

        return;
      }
      saveResult = true;
    }

    if (saveResult) {
      if (saveOnClose === null) {
        StyleUtils.rollbackScreen();
        router.push("/");
        router.refresh();
        StyleUtils.rollbackScreen();
      } else {
        saveOnClose();
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    const [bResult, statusCode, response] = await ApiUtils.request(`/api/versus/game/${game.nanoId}`, "DELETE", null);

    if (!bResult) {
      if (response["message"]) {
        alert(response["message"]);
      } else {
        alert("삭제 실패했습니다.");
      }

      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <VS.EditorLayout>
      <VS.EditorDataLayout>
        <VS.EditInfoBox>
          <span className="title">기본 정보</span>

          {/* 제목 */}
          <VersusInputText label={"제목"} placeholder={"제목을 입력해주세요."} value={title} setValue={setTitle} />

          {/* 썸네일 */}
          <VS.InputContainer>
            <VS.InputTitle className="mb-2">썸네일</VS.InputTitle>
            <VersusThumbnailImageEdit oldImageId={game.images[0]?.id} updateThumbnail={updateThumbnail} />
          </VS.InputContainer>

          {/* 내용 */}
          <VersusInputTextArea
            label={"내용"}
            placeholder={"게임에 대한 내용을 입력해주세요.(선택)"}
            value={content}
            setValue={setContent}
            rows={8}
          />
        </VS.EditInfoBox>
        <VS.EditChoiceBox>
          <span className="title">선택지</span>
          <VersusChoiceEdit
            game={game}
            updateChoice={updateChoice}
            choiceCountType={choiceCountType}
            setChoiceCountType={setChoiceCountType}
          />
        </VS.EditChoiceBox>
      </VS.EditorDataLayout>

      <VS.EditorControlLayout>
        {!CommonUtils.isStringNullOrEmpty(game.id) ? (
          <VS.EditorControlButton
            onClick={() => {
              handleDelete();
            }}
          >
            삭제
          </VS.EditorControlButton>
        ) : (
          <div></div>
        )}
        <div className="flex items-center space-x-2">
          <VS.EditorPrivacySetButton
            onClick={() => {
              setShowPrivacy(true);
            }}
          >
            {PrivacyTypeIcons[privacyType]}
            <div className="flex flex-col items-start">
              <span className="title">공개 옵션</span>
              <span className="value">{PrivacyTypeNames[privacyType]}</span>
            </div>
          </VS.EditorPrivacySetButton>
          {game.state !== GameState.BLOCK && (
            <VS.EditorControlButton
              onClick={() => {
                handleSave();
              }}
            >
              저장
            </VS.EditorControlButton>
          )}
        </div>
      </VS.EditorControlLayout>

      <ModalContainer isOpen={isShowPrivacy} setIsOpen={setShowPrivacy} isCloseByBackground={true} isBlur={true}>
        <VersusPrivacyModal
          privacyType={privacyType}
          setPrivacyType={setPrivacyType}
          close={() => {
            setShowPrivacy(false);
          }}
        />
      </ModalContainer>
    </VS.EditorLayout>
  );
}
