import * as UserStyles from '@/styles/UserStyles';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import UserInputText from './inputs/UserInputs';

import { SIGNUP_AGREEMENT } from '@/types/UserTypes';
import ApiUtils from '@/utils/ApiUtils';
import { AuthError } from 'next-auth';
import { signIn } from 'next-auth/react';

export enum LoginModalPage {
  LOGIN = 0,
  REGIST = 1,
  REGIST_AGREE = 2,
  FIND_PASSWORD = 3,
}

export interface ILoginModal {
  isModalShow: boolean;
  setModalShow: Dispatch<SetStateAction<boolean>>;
  defaultPage?: LoginModalPage;
}
const LoginModal = ({ isModalShow, setModalShow, defaultPage = LoginModalPage.LOGIN }: ILoginModal) => {
  const [page, setPage] = useState<LoginModalPage>(LoginModalPage.LOGIN);

  useEffect(() => {
    if (!isModalShow) {
      setPage(defaultPage);
    }
  }, [isModalShow, defaultPage]);

  return (
    <UserStyles.LoginContainer>
      <LoginPage page={page} setPage={setPage} />
      <RegistAgreePage page={page} setPage={setPage} setModalShow={setModalShow} />
      <RegistPage page={page} setPage={setPage} setModalShow={setModalShow} />
    </UserStyles.LoginContainer>
  );
};

export default LoginModal;

export interface IPage {
  page: LoginModalPage;
  setPage: Dispatch<SetStateAction<LoginModalPage>>;
  setModalShow?: Dispatch<SetStateAction<boolean>>;
}
const LoginPage = ({ page, setPage }: IPage) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const login = async () => {
    if (email === '' || password === '') {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
    }

    try {
      const response = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });

      const errorMessage = response?.error;
      if (!errorMessage) {
        return;
      } else if (errorMessage === 'CredentialsSignin') {
        alert('로그인 성공');
        return;
      } else {
        alert('이메일 및 비밀번호를 확인해주세요.');
        return;
      }
    } catch (error) {
      if (error instanceof AuthError) {
        return '로그인 실패';
      }
      throw error;
    }
  };

  return (
    <UserStyles.LoginPageContainer
      className={`
        ${page === LoginModalPage.LOGIN ? 'top-0' : '-top-full'}
        bg-linear-to-t from-stone-300 to-stone-200 from-10%
      `}
    >
      <UserStyles.LoginTitleBox>
        <div className="aspect-square h-28 mb-4 rounded-xl bg-linear-to-tr from-indigo-600 to-sky-300"></div>
        <h1>로그인</h1>
        <h3>
          VS게임 추즈밍을 <br />더 즐기시려면 로그인해주세요.
        </h3>
      </UserStyles.LoginTitleBox>
      <div className="flex flex-col w-full space-y-2">
        <UserInputText
          label={'이메일'}
          placeholder={'honggildong@example.com'}
          value={email}
          setValue={setEmail}
          onEnter={() => {
            login();
          }}
        />
        <UserInputText
          label={'비밀번호'}
          placeholder={''}
          type={'password'}
          value={password}
          setValue={setPassword}
          onEnter={() => {
            login();
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full mt-4 mb-2 space-y-2">
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}
        <UserStyles.LoginButton
          onClick={() => {
            login();
          }}
        >
          로그인
        </UserStyles.LoginButton>
        <UserStyles.LoginRegistButton
          onClick={() => {
            setPage(LoginModalPage.REGIST_AGREE);
          }}
        >
          회원가입
        </UserStyles.LoginRegistButton>
      </div>
    </UserStyles.LoginPageContainer>
  );
};

const RegistAgreePage = ({ page, setPage, setModalShow }: IPage) => {
  const [isAgree, setAgree] = useState<boolean>(false);

  return (
    <UserStyles.LoginPageContainer
      className={`
                ${page === LoginModalPage.LOGIN ? 'top-full' : ''}
                ${page === LoginModalPage.REGIST_AGREE ? 'top-0' : ''}
                ${page === LoginModalPage.REGIST ? '-top-full' : ''}
            `}
    >
      <UserStyles.LoginPageHead>
        <UserStyles.LoginPageHeadPageButton
          onClick={() => {
            setPage(LoginModalPage.LOGIN);
          }}
        >
          이전
        </UserStyles.LoginPageHeadPageButton>
      </UserStyles.LoginPageHead>
      <UserStyles.LoginTitleBox>
        <h1>이용약관</h1>
        <h3>회원가입 시 아래의 약관 동의가 필요합니다.</h3>
      </UserStyles.LoginTitleBox>

      <div className="flex flex-col w-full h-72 space-y-2">
        <UserStyles.AgreeSection>
          <UserStyles.AgreeTitleBox>
            <span className="title">개인정보 동의</span>
            <div
              className={`agree ${isAgree ? 'active' : ''}`}
              onClick={() => {
                setAgree(!isAgree);
              }}
            >
              <span>동의(필수)</span>
              {isAgree ? <i className="fa-solid fa-circle-check"></i> : <i className="fa-regular fa-circle"></i>}
            </div>
          </UserStyles.AgreeTitleBox>
          <UserStyles.AgreeContent>
            <p>{SIGNUP_AGREEMENT}</p>
          </UserStyles.AgreeContent>
        </UserStyles.AgreeSection>
      </div>

      <div className="flex justify-center items-center w-full mt-4 space-y-2">
        <UserStyles.LoginButton
          disabled={!isAgree}
          onClick={() => {
            setPage(LoginModalPage.REGIST);
          }}
        >
          다음으로
        </UserStyles.LoginButton>
      </div>
    </UserStyles.LoginPageContainer>
  );
};

const isDuplicatedEmail = async (email: string): Promise<string> => {
  if (!email) {
    return '';
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return '이메일을 올바르게 입력해주세요.';
  }

  const { result, data: isDuplicated } = await ApiUtils.request('/api/users/email_check', 'POST', {
    data: {
      email: email,
    },
  });

  return isDuplicated ? '이미 존재하는 이메일입니다.' : '';
};

const RegistPage = ({ page, setPage, setModalShow }: IPage) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPasswordSame, setPasswordSame] = useState<boolean>(false);

  const [emailMessage, setEmailMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setPasswordSame(password1 === password2);
  }, [password1, password2]);

  const checkEmailDuplicate = async () => {
    const message = await isDuplicatedEmail(email);
    setEmailMessage(message);
  };

  const handleRegist = async () => {
    const validateMessages: Array<string> = [];
    if (email === '') {
      validateMessages.push('이메일을 입력해주세요.');
    }
    if (name === '') {
      validateMessages.push('닉네임을 입력해주세요.');
    }
    if (password1 === '' || password2 === '') {
      validateMessages.push('비밀번호를 입력해주세요.');
    }
    if (validateMessages.length > 0) {
      alert(validateMessages.join('\n'));
      return;
    }

    const emailMessage = await isDuplicatedEmail(email);
    if (emailMessage) {
      setEmailMessage(emailMessage);
      return;
    }

    const data = {
      email: email,
      password: password1,
      name: name,
    };
    const { result, data: responseData } = await ApiUtils.request('/api/users/regist', 'POST', { data });

    if (result) {
      alert('회원가입되었습니다.');
      try {
        await signIn('credentials', {
          email: email,
          password: password1,
        });
        setModalShow?.(false);
        return;
      } catch (error) {
        if (error instanceof AuthError) {
          return '로그인 실패';
        }
        throw error;
      }
    } else {
      const _message = responseData.message ?? '실패했습니다.';
      setErrorMessage(_message);
    }
  };

  return (
    <UserStyles.LoginPageContainer
      className={`
        ${page === LoginModalPage.REGIST ? 'top-0' : 'top-full'}
      `}
    >
      <UserStyles.LoginPageHead>
        <UserStyles.LoginPageHeadPageButton
          onClick={() => {
            setPage(LoginModalPage.REGIST_AGREE);
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
        <UserInputText label={'닉네임'} placeholder={'홍길동'} value={name} setValue={setName} disabled={isLoading} />
        <UserInputText
          label={'이메일'}
          placeholder={'honggildong@example.com'}
          value={email}
          setValue={setEmail}
          disabled={isLoading}
          labelMessage={emailMessage && <span className="text-xs text-rose-600">{emailMessage}</span>}
          onBlur={() => checkEmailDuplicate()}
        />
        <UserInputText
          label={'비밀번호'}
          placeholder={''}
          type={'password'}
          value={password1}
          setValue={setPassword1}
          disabled={isLoading}
        />
        <UserInputText
          label={'비밀번호 확인'}
          placeholder={''}
          type={'password'}
          value={password2}
          setValue={setPassword2}
          disabled={isLoading}
          labelMessage={!isPasswordSame && <span className="text-xs text-rose-600">비밀번호가 일치하지 않습니다.</span>}
        />
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      </div>
      <div className="flex justify-center items-center w-full mt-4 space-y-2">
        <UserStyles.LoginButton
          onClick={() => {
            handleRegist();
          }}
        >
          회원가입
        </UserStyles.LoginButton>
      </div>
    </UserStyles.LoginPageContainer>
  );
};
