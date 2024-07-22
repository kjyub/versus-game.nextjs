import { StyleProps } from "@/types/StyleTypes"
import tw from "tailwind-styled-components"

export const Body = tw.body`
    flex flex-col w-screen h-screen max-h-screen
    bg-blue-500
`

export const NavBox = tw.div`
    sticky top-0 z-50
    flex justify-center items-center w-screen h-14 mb-2
    backdrop-blur-xl
    [&>.title]:text-xl [&>.title]:font-bold [&>.title]:text-black
`

export const NavButtonContainer = tw.div`
    ${(props: StyleProps) =>
        props.$is_show ? "opacity-100 z-10" : "opacity-0 -z-10"}
`
export const NavButton = tw.button`
    flex justify-center items-center 
    max-sm:px-2 sm:px-4 py-1
    rounded-md hover:bg-black/20
    text-stone-800/80 text-lg font-semibold
    duration-200
`

export const ItemAddButtonContainer = tw(NavButtonContainer)`
    absolute max-sm:left-2 sm:left-4
`

export const LoginButtonContainer = tw.div`
    absolute max-sm:right-2 sm:right-4
    ${(props: StyleProps) =>
        props.$is_show ? "opacity-100 z-50" : "opacity-0 -z-10"}
`
export const LoginButton = tw.button`
    flex justify-center items-center 
    max-sm:px-4 sm:px-10 py-2
    rounded-full bg-white/70 hover:bg-white/90
    text-black/70 text-base
    duration-200
`

export const PageLayout = tw.div`
    flex flex-col items-center w-screen
`

export const LoginLayout = tw.div`
    absolute right-0
    ${(props: StyleProps) =>
        props.$is_show ? "top-12 z-50 opacity-100" : "top-8 -z-20 opacity-0"}
    flex flex-center
    duration-200
`
