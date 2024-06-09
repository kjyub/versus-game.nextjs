import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as UserStyles from "@/styles/UserStyles"
import UserInputText from "./inputs/UserInputs"

import { signIn, useSession } from "next-auth/react"
import { AuthError } from "next-auth"
import ApiUtils from "@/utils/ApiUtils"

export enum LoginModalPage {
    LOGIN,
    REGIST,
    FIND_PASSWORD,
}

export interface ILoginModal {
    isModalShow: boolean
    setModalShow: Dispatch<SetStateAction<boolean>>
    defaultPage: LoginModalPage
}
const LoginModal = ({
    isModalShow,
    setModalShow,
    defaultPage = LoginModalPage.LOGIN,
}: ILoginModal) => {
    const [page, setPage] = useState<LoginModalPage>(LoginModalPage.LOGIN)

    useEffect(() => {
        if (!isModalShow) {
            setPage(defaultPage)
        }
    }, [isModalShow, defaultPage])

    return (
        <UserStyles.LoginContainer>
            <LoginPage page={page} setPage={setPage} />
            <RegistPage
                page={page}
                setPage={setPage}
                setModalShow={setModalShow}
            />
        </UserStyles.LoginContainer>
    )
}

export default LoginModal

export interface IPage {
    page: LoginModalPage
    setPage: Dispatch<SetStateAction<LoginModalPage>>
    setModalShow: Dispatch<SetStateAction<boolean>>
}
const LoginPage = ({ page, setPage }: IPage) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [errorMessage, setErrorMessage] = useState<string>("")

    const login = async () => {
        if (email === "" || password === "") {
            setErrorMessage("이메일과 비밀번호를 입력해주세요.")
        }

        try {
            const response = await signIn("credentials", {
                email: email,
                password: password,
            })
            if (response?.status === "200") {
                alert("로그인 성공")
                return
            }
        } catch (error) {
            if (error instanceof AuthError) {
                return "로그인 실패"
            }
            throw error
        }
    }

    return (
        <UserStyles.LoginPageContainer
            className={`${
                page === LoginModalPage.LOGIN ? "left-0" : "-left-full"
            }`}
        >
            <UserStyles.LoginTitleBox>
                <div className="aspect-square h-28 mb-4 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-300"></div>
                <h1>로그인</h1>
                <h3>
                    Versus Game을 <br />더 즐기시려면 로그인해주세요.
                </h3>
            </UserStyles.LoginTitleBox>
            <div className="flex flex-col w-full space-y-2">
                <UserInputText
                    label={"이메일"}
                    placeholder={"honggildong@example.com"}
                    value={email}
                    setValue={setEmail}
                    onEnter={() => {
                        login()
                    }}
                />
                <UserInputText
                    label={"비밀번호"}
                    placeholder={""}
                    type={"password"}
                    value={password}
                    setValue={setPassword}
                    onEnter={() => {
                        login()
                    }}
                />
            </div>
            <div className="flex flex-col items-center w-full mt-4 mb-2 space-y-2">
                {!CommonUtils.isStringNullOrEmpty(errorMessage) && (
                    <span className="text-red-500">{errorMessage}</span>
                )}
                <UserStyles.LoginButton
                    onClick={() => {
                        login()
                    }}
                >
                    로그인
                </UserStyles.LoginButton>
                <UserStyles.LoginRegistButton
                    onClick={() => {
                        setPage(LoginModalPage.REGIST)
                    }}
                >
                    회원가입
                </UserStyles.LoginRegistButton>
            </div>
        </UserStyles.LoginPageContainer>
    )
}
const RegistPage = ({ page, setPage, setModalShow }: IPage) => {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password1, setPassword1] = useState<string>("")
    const [password2, setPassword2] = useState<string>("")

    const [isLoading, setLoading] = useState<boolean>(false)
    const [isPasswordSame, setPasswordSame] = useState<boolean>(false)

    const [emailMessage, setEmailMessage] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")

    useEffect(() => {
        checkEmailDuplicate()
    }, [email])

    useEffect(() => {
        setPasswordSame(password1 === password2)
    }, [password1, password2])

    const checkEmailDuplicate = async () => {
        if (CommonUtils.isStringNullOrEmpty(email)) {
            setEmailMessage("")
            return
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            setEmailMessage("이메일을 올바르게 입력해주세요.")
            return
        }

        const [bResult, statusCode, response] = await ApiUtils.request(
            "/api/users/email_check",
            "POST",
            null,
            { email: email },
        )

        setEmailMessage(response ? "이미 존재하는 이메일입니다." : "")
    }

    const handleRegist = async () => {
        let validateMessages: Array<string> = []
        if (email === "") {
            validateMessages.push("이메일을 입력해주세요.")
        }
        if (name === "") {
            validateMessages.push("닉네임을 입력해주세요.")
        }
        if (password1 === "" || password2 === "") {
            validateMessages.push("비밀번호를 입력해주세요.")
        }
        if (validateMessages.length > 0) {
            alert(validateMessages.join("\n"))
            return
        }

        const data = {
            email: email,
            password: password1,
            name: name,
        }
        const [bResult, statusCode, response] = await ApiUtils.request(
            "/api/users/regist",
            "POST",
            null,
            data,
        )

        if (bResult) {
            alert("회원가입되었습니다.")
            try {
                const response = await signIn("credentials", {
                    email: email,
                    password: password1,
                })
                if (response?.status === "200") {
                    setModalShow(false)
                    return
                }
            } catch (error) {
                if (error instanceof AuthError) {
                    return "로그인 실패"
                }
                throw error
            }
        } else {
            const _message = response["message"]
            setErrorMessage(_message)
        }
    }

    return (
        <UserStyles.LoginPageContainer
            className={`${
                page === LoginModalPage.REGIST ? "left-0" : "left-full"
            }`}
        >
            <UserStyles.LoginPageHead>
                <UserStyles.LoginPageHeadPageButton
                    onClick={() => {
                        setPage(LoginModalPage.LOGIN)
                    }}
                >
                    이전
                </UserStyles.LoginPageHeadPageButton>
            </UserStyles.LoginPageHead>
            <UserStyles.LoginTitleBox>
                <h1>회원가입</h1>
                <h3>이메일로 간편하게 회원가입이 가능합니다.</h3>
            </UserStyles.LoginTitleBox>
            <div className="flex flex-col w-full space-y-2">
                <UserInputText
                    label={"닉네임"}
                    placeholder={"홍길동"}
                    value={name}
                    setValue={setName}
                    disabled={isLoading}
                />
                <UserInputText
                    label={"이메일"}
                    placeholder={"honggildong@example.com"}
                    value={email}
                    setValue={setEmail}
                    disabled={isLoading}
                    labelMessage={
                        !CommonUtils.isStringNullOrEmpty(emailMessage) && (
                            <span className="text-xs text-rose-600">
                                {emailMessage}
                            </span>
                        )
                    }
                />
                <UserInputText
                    label={"비밀번호"}
                    placeholder={""}
                    type={"password"}
                    value={password1}
                    setValue={setPassword1}
                    disabled={isLoading}
                />
                <UserInputText
                    label={"비밀번호 확인"}
                    placeholder={""}
                    type={"password"}
                    value={password2}
                    setValue={setPassword2}
                    disabled={isLoading}
                    labelMessage={
                        !isPasswordSame && (
                            <span className="text-xs text-rose-600">
                                비밀번호가 일치하지 않습니다.
                            </span>
                        )
                    }
                />
                {!CommonUtils.isStringNullOrEmpty(errorMessage) && (
                    <span className="text-red-500">{errorMessage}</span>
                )}
            </div>
            <div className="flex justify-center items-center w-full mt-4 space-y-2">
                <UserStyles.LoginButton
                    onClick={() => {
                        handleRegist()
                    }}
                >
                    회원가입
                </UserStyles.LoginButton>
            </div>
        </UserStyles.LoginPageContainer>
    )
}
