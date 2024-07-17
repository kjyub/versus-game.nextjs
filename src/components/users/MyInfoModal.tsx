import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as UserStyles from "@/styles/UserStyles"
import UserInputText from "./inputs/UserInputs"

import { signIn, signOut, useSession } from "next-auth/react"
import { AuthError } from "next-auth"
import ApiUtils from "@/utils/ApiUtils"
import User from "@/types/user/User"

export interface MyInfoModal {
    isModalShow: boolean
    user: User
}
const MyInfoModal = ({ isModalShow, user }: MyInfoModal) => {
    const [email, setEmail] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [passwordCurrent, setPasswordCurrent] = useState<string>("")
    const [password1, setPassword1] = useState<string>("")
    const [password2, setPassword2] = useState<string>("")

    useEffect(() => {
        if (isModalShow) {
            getUserInfo()
        }
    }, [isModalShow, user])

    useEffect(() => {
        if (CommonUtils.isStringNullOrEmpty(passwordCurrent)) {
            setPassword1("")
            setPassword2("")
        }
    }, [passwordCurrent])

    const getUserInfo = () => {
        if (CommonUtils.isStringNullOrEmpty(user.id)) {
            return
        }

        setName(user.name)
        setEmail(user.email)
    }

    const handleUserUpdate = async () => {
        if (CommonUtils.isStringNullOrEmpty(user.id)) {
            return
        }

        if (CommonUtils.isStringNullOrEmpty(name)) {
            alert("이름은 빈값을 넣을 수 없습니다.")
            return
        }

        if (
            !CommonUtils.isStringNullOrEmpty(passwordCurrent) &&
            !CommonUtils.isValidPassword(password1)
        ) {
            alert("유효하지 않은 새 비밀번호입니다.")
            return
        }
        if (password1 !== password2) {
            alert("새 비밀번호가 다릅니다.")
            return
        }

        const data = {
            name: name,
            passwordCurrent: passwordCurrent,
            passwordNew: password1,
        }

        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/users/user_info/${user.id}`,
            "PUT",
            null,
            data,
        )

        if (bResult) {
            const user = new User()
            user.parseResponse(response)
            setName(user.name)
            alert("저장되었습니다.")
        } else {
            alert(response["message"] ?? "요청 실패했습니다.")
        }
    }

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <UserStyles.MyInfoContainer>
            <UserStyles.MyInfoSection>
                <span className="title">회원 정보 수정</span>
                <div className="flex flex-col w-full space-y-3">
                    <UserInputText
                        label={"이메일"}
                        placeholder={"example@example.com"}
                        value={email}
                        disabled={true}
                    />
                    <UserInputText
                        label={"닉네임"}
                        placeholder={"홍길동"}
                        value={name}
                        setValue={setName}
                    />
                    <UserInputText
                        type={"password"}
                        label={"현재 비밀번호"}
                        labelMessage={
                            <span className="text-xs text-stone-500">
                                {"비밀번호를 변경하시려면 입력해주세요."}
                            </span>
                        }
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
                            labelMessage={
                                <span className="text-xs text-stone-500">
                                    {"영문 숫자 포함 6자리부터 가능합니다."}
                                </span>
                            }
                            value={password1}
                            setValue={setPassword1}
                        />
                        <UserInputText
                            type={"password"}
                            label={"새 비밀번호 확인"}
                            value={password2}
                            setValue={setPassword2}
                        />
                    </div>
                    <button className="px-2 py-0 5 ml-auto text-stone-600 text-sm">
                        회원 탈퇴
                    </button>
                </div>
            </UserStyles.MyInfoSection>
            <div className="flex flex-col w-full mt-auto space-y-2">
                <UserStyles.MyInfoSaveButton
                    onClick={() => {
                        handleUserUpdate()
                    }}
                >
                    저장
                </UserStyles.MyInfoSaveButton>
                <UserStyles.LogoutButton
                    onClick={() => {
                        handleLogout()
                    }}
                >
                    로그아웃
                </UserStyles.LogoutButton>
            </div>
        </UserStyles.MyInfoContainer>
    )
}
export default MyInfoModal
