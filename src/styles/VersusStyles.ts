import tw from "tailwind-styled-components"

export const MainSearchLayout = tw.div`
    flex flex-col w-128
`

export const SearchInputBox = tw.div`
    flex items-center px-4 py-2
    rounded-full bg-black/50 backdrop-blur
    text-white/90

    [&>input]:w-full [&>input]:bg-transparent
`
