import { StyleProps } from "@/types/StyleTypes"
import tw from "tailwind-styled-components"

export const LoginContainer = tw.div`
    relative
    flex flex-col max-sm:w-[90vw] sm:w-72 h-128
    rounded-lg bg-white/50 backdrop-blur
    drop-shadow-xl
    overflow-hidden
`
export const LoginPageContainer = tw.div`
    absolute
    flex flex-col w-full h-full p-4
    duration-300
`
export const LoginPageHead = tw.div`
    flex items-center w-full
`
export const LoginPageHeadPageButton = tw.button`
    px-2 py-1
    text-rose-500 rounded-md 
    bg-transparent
    hover:bg-red-100
    duration-200
`
export const LoginTitleBox = tw.div`
    flex flex-col flex-center w-full h-full
    [&>h1]:text-lg [&>h1]:text-stone-800 [&>h1]:font-semibold
    [&>h3]:text-sm [&>h3]:text-stone-700 [&>h3]:font-light [&>h3]:text-center
`
export const LoginButton = tw.button`
    flex items-center w-fit px-8 py-2
    rounded-xl bg-gradient-to-r from-rose-700 to-rose-500
    text-white font-medium
    shadow-lg hover:shadow-xl
    duration-200
`
export const LoginRegistButton = tw.button`
    px-4 pt-2
    text-rose-700
    hover:underline underline-offset-2
`

export const InputContainer = tw.div`
    flex flex-col w-full
`
export const InputTitle = tw.span`
    text-sm text-stone-700
`
export const InputBox = tw.div`
    flex items-center w-full px-4 py-2
    rounded-full 
    ${(props: StyleProps) =>
        props.$disabled ? "bg-stone-300/50" : "bg-stone-200/50"}
    ${(props: StyleProps) => (props.$is_focus ? "ring-1 ring-stone-400" : "")}
    duration-300
    [&>input]:w-full [&>input]:bg-transparent [&>input]:text-stone-700 [&>input]:text-sm
`

export const MyInfoContainer = tw.div`
    relative
    flex flex-col w-64 h-64 p-4
    rounded-lg bg-white/50 backdrop-blur
    drop-shadow-xl
    overflow-hidden
`
export const MyInfoSection = tw.div`
    flex flex-col mb-2
    [&>.title]:text-stone-700 [&>.title]:text-lg [&>.title]:mb-2
`
export const MyInfoSaveButton = tw.button`
    flex flex-center w-full h-9 mt-1
    rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600
    duration-200
`
export const LogoutButton = tw.button`
    flex flex-center w-full h-9 mt-auto
    rounded-full bg-red-100 hover:bg-red-200 text-red-600
    duration-200
`
