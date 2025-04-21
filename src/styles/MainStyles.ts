import { StyleProps } from '@/types/StyleTypes'
import tw from 'tailwind-styled-components'

export const Body = tw.body`
    flex flex-col w-screen h-screen max-h-screen
    overflow-hidden
    bg-blue-500
`

export const NavBox = tw.div`
    flex justify-center items-center w-screen max-md:h-12 md:h-14
    [&>.title]:text-xl [&>.title]:font-semibold [&>.title]:text-stone-900
`

export const NavButtonList = tw.div`
    items-center space-x-2
`

export const NavButtonContainer = tw.div`
    ${(props: StyleProps) => (props.$is_show ? 'opacity-100 z-10' : 'opacity-0 -z-10')}
`
export const NavButton = tw.button`
    flex justify-center items-center 
    max-md:px-2 md:px-4 py-1
    rounded-md hover:bg-black/20
    text-stone-800/80 text-lg font-semibold
    duration-200
`
export const NavMobileMenuButton = tw(NavButton)`
    !px-3 py-1
    rounded-md hover:bg-transparent
    text-stone-800/90 text-base font-semibold
    duration-200
`

export const ItemAddButtonContainer = tw(NavButtonContainer)`
    absolute max-md:left-2 md:left-4
`

export const LoginButtonContainer = tw.div`
    absolute max-md:right-2 md:right-4
    ${(props: StyleProps) => (props.$is_show ? 'opacity-100 z-50' : 'opacity-0 -z-10')}
`
export const LoginButton = tw.button`
    flex justify-center items-center 
    max-md:px-4 md:px-10 max-md:py-1 md:py-2
    rounded-full max-md:bg-transparent
    md:bg-white/60 md:hover:bg-white/70
    text-black/70 text-base 
    max-md:font-semibold md:font-medium
    duration-200
`

export const PageLayout = tw.div`
    flex flex-col items-center w-screen
`

export const LoginLayout = tw.div`
    absolute right-0
    ${(props: StyleProps) => (props.$is_show ? 'max-md:top-10 md:top-12 z-50 opacity-100' : 'top-8 -z-20 opacity-0')}
    flex flex-center
    md:duration-200
`

export const MobileNavLayout = tw.div`
    absolute left-0
    ${(props: StyleProps) => (props.$is_show ? 'top-10 z-50 opacity-100' : 'top-8 -z-20 opacity-0')}
    flex flex-center
    md:duration-200
`
export const MobileNavContainer = tw.div`
    relative
    flex flex-col w-64 p-4
    rounded-lg bg-black/40 backdrop-blur-lg
    drop-shadow-xl
    overflow-hidden
`
export const MobileNavList = tw.div`
    flex flex-col w-full space-y-5
`
export const MobileNavButton = tw.button`
    flex items-center
    font-medium text-stone-200
    [&>i]:w-8 [&>i]:mr-2
`
