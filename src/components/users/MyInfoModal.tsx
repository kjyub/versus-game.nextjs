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
    userId: string
}
const MyInfoModal = ({ isModalShow, userId }: MyInfoModal) => {
    const [name, setName] = useState<string>("")

    useEffect(() => {
        if (isModalShow) {
            getUserInfo()
        }
    }, [isModalShow, userId])

    const getUserInfo = async () => {
        if (CommonUtils.isStringNullOrEmpty(userId)) {
            return
        }
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/users/user_info/${userId}`,
            "GET",
        )

        if (bResult) {
            const user = new User()
            user.parseResponse(response)
            setName(user.name)
        } else {
            alert(response)
        }
    }

    const handleUserUpdate = async () => {
        if (CommonUtils.isStringNullOrEmpty(userId)) {
            return
        }

        if (CommonUtils.isStringNullOrEmpty(name)) {
            alert("이름은 빈값을 넣을 수 없습니다.")
            return
        }

        const data = {
            name: name,
        }

        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/users/user_info/${userId}`,
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
            alert(response)
        }
    }

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <UserStyles.MyInfoContainer>
            <UserStyles.MyInfoSection>
                <span className="title">회원 정보 수정</span>
                <UserInputText
                    label={"닉네임"}
                    placeholder={"홍길동"}
                    value={name}
                    setValue={setName}
                />
            </UserStyles.MyInfoSection>
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
        </UserStyles.MyInfoContainer>
    )
}
export default MyInfoModal
