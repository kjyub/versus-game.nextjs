import * as UserStyles from "@/styles/UserStyles";
import CommonUtils from "@/utils/CommonUtils";
import { useEffect, useState } from "react";
import UserInputText from "./inputs/UserInputs";

import User from "@/types/user/User";
import ApiUtils from "@/utils/ApiUtils";
import { signOut } from "next-auth/react";

export interface IMyInfoModal {
  isModalShow: boolean;
  user: User;
}
const MyInfoModal = ({ isModalShow, user }: IMyInfoModal) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [passwordCurrent, setPasswordCurrent] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalShow) {
      getUserInfo();
    }
  }, [isModalShow, user]);

  useEffect(() => {
    if (!passwordCurrent) {
      setPassword1("");
      setPassword2("");
    }
  }, [passwordCurrent]);

  const getUserInfo = () => {
    if (!user.id) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
  };

  const handleUserUpdate = async () => {
    if (!user.id) {
      return;
    }

    if (!name) {
      alert("이름은 빈값을 넣을 수 없습니다.");
      return;
    }

    if (!passwordCurrent) {
      setError("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (passwordCurrent && !CommonUtils.isValidPassword(password1)) {
      alert("비밀번호는 6자 이상의 영문자와 숫자를 포함해야 합니다.");
      return;
    }
    if (password1 !== password2) {
      alert("새 비밀번호가 다릅니다.");
      return;
    }

    const data = {
      name: name,
      passwordCurrent: passwordCurrent,
      passwordNew: password1,
    };

    const { result, data: responseData } = await ApiUtils.request(`/api/users/user_info/${user.id}`, "PUT", {
      data,
    });

    if (result) {
      const user = new User();
      user.parseResponse(responseData);
      setName(user.name);
      alert("저장되었습니다.");
    } else {
      alert(responseData["message"] ?? "요청 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleDelete = async () => {
    if (!confirm("회원 탈퇴하시겠습니까?")) {
      return;
    }

    if (!passwordCurrent) {
      setError("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!user.id) {
      setError("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    let data = {
      passwordCurrent,
    };

    const { result, data: responseData } = await ApiUtils.request(`/api/users/user_info/${user.id}`, "DELETE", {
      data,
    });

    if (result) {
      alert("회원 탈퇴 처리되었습니다.");
      await signOut();
      return;
    } else {
      alert(responseData["message"] ?? "요청 실패했습니다.");
    }
  };

  return (
    <UserStyles.MyInfoContainer>
      <UserStyles.MyInfoSection>
        <span className="title">회원 정보 수정</span>
        <div className="flex flex-col w-full space-y-3">
          <UserInputText label={"이메일"} placeholder={"example@example.com"} value={email} disabled={true} />
          <UserInputText label={"닉네임"} placeholder={"홍길동"} value={name} setValue={setName} />
          <UserInputText
            type={"password"}
            label={"현재 비밀번호"}
            labelMessage={<span className="text-xs text-stone-500">{"비밀번호를 변경하시려면 입력해주세요."}</span>}
            autoPassword={false}
            value={passwordCurrent}
            setValue={setPasswordCurrent}
          />
          <div
            className={`${
              passwordCurrent === "" ? "opacity-0" : "opacity-100"
            } duration-300 flex flex-col w-full space-y-3`}
          >
            <UserInputText
              type={"password"}
              label={"새 비밀번호"}
              labelMessage={<span className="text-xs text-stone-500">{"영문 숫자 포함 6자리부터 가능합니다."}</span>}
              value={password1}
              setValue={setPassword1}
            />
            <UserInputText type={"password"} label={"새 비밀번호 확인"} value={password2} setValue={setPassword2} />
          </div>
          <button
            className="px-2 py-0 5 ml-auto text-stone-600 text-sm"
            onClick={() => {
              handleDelete();
            }}
          >
            회원 탈퇴
          </button>
        </div>
      </UserStyles.MyInfoSection>
      <div className="flex flex-col w-full mt-auto space-y-2">
        <UserStyles.MyInfoSaveButton
          onClick={() => {
            handleUserUpdate();
          }}
        >
          저장
        </UserStyles.MyInfoSaveButton>
        <UserStyles.LogoutButton
          onClick={() => {
            handleLogout();
          }}
        >
          로그아웃
        </UserStyles.LogoutButton>
      </div>
    </UserStyles.MyInfoContainer>
  );
};
export default MyInfoModal;
