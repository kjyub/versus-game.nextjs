import { StyleProps } from "@/types/StyleTypes";
import tw from "tailwind-styled-components";

export const LoginContainer = tw.div`
    relative
    flex flex-col max-sm:w-64 sm:w-72 h-128
    rounded-lg bg-white/50 backdrop-blur-sm
    drop-shadow-xl
    overflow-hidden
`;
export const LoginPageContainer = tw.div`
    absolute
    flex flex-col w-full h-full p-4
    login-page-transition
`;
export const LoginPageHead = tw.div`
    flex items-center w-full
`;
export const LoginPageHeadPageButton = tw.button`
    px-2 py-1
    text-rose-500 rounded-md 
    bg-transparent
    hover:bg-red-100
    duration-200
`;
export const LoginTitleBox = tw.div`
    flex flex-col flex-center w-full h-full
    [&>h1]:text-lg [&>h1]:text-stone-800 [&>h1]:font-semibold
    [&>h3]:text-sm [&>h3]:text-stone-700 [&>h3]:font-light [&>h3]:text-center
`;
export const LoginButton = tw.button`
    flex items-center w-fit px-8 py-2
    rounded-xl 
    ${(props: StyleProps) => (props.disabled ? "bg-stone-500" : "bg-linear-to-r from-rose-700 to-rose-500")}
    text-white font-medium
    shadow-lg hover:shadow-xl
    duration-200
`;
export const LoginRegistButton = tw.button`
    px-4 pt-2
    text-rose-700
    hover:underline underline-offset-2
`;

export const AgreeSection = tw.div`
    flex flex-col w-full h-full p-2 space-y-2
`;
export const AgreeTitleBox = tw.div`
    flex justify-between items-center w-full
    [&>.title]:font-semibold [&>.title]:text-stone-800
    [&>.agree]:flex [&>.agree]:items-center [&>.agree]:px-2 [&>.agree]:py-1 [&>.agree]:space-x-1 
    [&>.agree]:rounded-md [&>.agree]:hover:bg-stone-100/40
    [&>.agree]:text-stone-500 [&>.agree.active]:text-indigo-600
    [&>.agree]:duration-200 [&>.agree]:cursor-pointer
`;
export const AgreeContent = tw.div`
    flex w-full max-h-full px-3 py-2
    rounded-md bg-stone-100/30
    font-light text-sm text-stone-600
    overflow-y-auto scroll-transparent scroll-overlay
    [&>pre]:w-full
`;

export const InputContainer = tw.div`
    flex flex-col w-full
`;
export const InputTitle = tw.span`
    text-sm text-stone-700
`;
export const InputBox = tw.div`
    flex items-center w-full px-4 py-2
    rounded-full 
    ${(props: StyleProps) =>
      props.$disabled ? "bg-stone-500/10 [&>input]:text-stone-600" : "bg-stone-100/70 [&>input]:text-stone-700"}
    ${(props: StyleProps) => (props.$is_focus ? "ring-2 ring-indigo-500" : "ring-1 ring-stone-300")}
    duration-300
    [&>input]:flex [&>input]:items-center [&>input]:w-full 
    [&>input]:bg-transparent [&>input]:text-sm
`;

export const MyInfoContainer = tw.div`
    relative
    flex flex-col w-64 h-[36rem] p-4
    rounded-lg bg-stone-200
    drop-shadow-xl
    overflow-hidden
`;
export const MyInfoSection = tw.div`
    flex flex-col mb-2
    [&>.title]:mb-2
    [&>.title]:font-semibold [&>.title]:text-stone-700 [&>.title]:text-lg
`;
export const MyInfoSaveButton = tw.button`
    flex flex-center w-full h-9 mt-1
    rounded-full bg-blue-200 sm:hover:bg-blue-300 text-blue-600
    duration-200
`;
export const LogoutButton = tw.button`
    flex flex-center w-full h-9
    rounded-full bg-red-200 sm:hover:bg-red-300 text-red-600
    duration-200
`;
