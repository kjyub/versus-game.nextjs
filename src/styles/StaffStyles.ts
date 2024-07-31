import { StyleProps } from "@/types/StyleTypes"
import tw from "tailwind-styled-components"

export const GameStateButton = tw.button`
    flex flex-center w-full h-6
    text-sm
    border border-stone-400
    ${(props: StyleProps) => props.$is_active ? "bg-stone-400 text-white" : "text-stone-400 hover:bg-stone-800"}
`