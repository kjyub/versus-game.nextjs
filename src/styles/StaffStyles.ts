import { StyleProps } from '@/types/StyleTypes'
import tw from 'tailwind-styled-components'

export const GameStateButton = tw.button`
    flex flex-center w-full h-5
    text-sm
    border border-stone-400
    ${(props: StyleProps) => (props.$is_active ? 'bg-stone-400 text-white' : 'text-stone-400 hover:bg-stone-800')}
`
export const GameInfoKeyValueBox = tw.div`
    flex flex-col w-24
    text-sm
    [&>.label]:font-light [&>.label]:text-stone-400
    [&>.value]:font-normal [&>.value]:text-stone-200
`
