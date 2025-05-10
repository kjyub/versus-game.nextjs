import { StyleProps } from "@/types/StyleTypes";
import tw from "tailwind-styled-components";

export const Body = tw.body`
    flex flex-col w-full min-h-screen max-h-screen
`;

export const NavBox = tw.div`
    fixed top-0 left-0 right-0 z-50
    flex items-center w-full max-md:h-12 md:h-14 max-md:px-2 md:px-4
    backdrop-blur-3xl
    [&>.title]:text-xl [&>.title]:font-semibold [&>.title]:text-stone-900
`;

export const NavTitle = tw.div`
    absolute inset-0
    flex justify-center items-center w-full h-full
    text-xl font-semibold text-stone-900
`;

export const NavButtonList = tw.div`
    items-center gap-2
`;

export const NavButtonContainer = tw.div`
    ${(props: StyleProps) => (props.$is_show ? "opacity-100 z-10" : "opacity-0 -z-10")}
`;
export const NavButton = tw.button`
    flex justify-center items-center 
    max-md:px-2 md:px-4 py-1
    rounded-md hover:bg-black/20
    text-stone-800/80 text-lg font-semibold
    duration-200
`;
export const NavMobileMenuButton = tw(NavButton)`
    !px-3 py-1
    rounded-md hover:bg-transparent
    text-stone-800/90 text-base font-semibold
    duration-200
`;
export const LoginButtonContainer = tw.div`
    ${(props: StyleProps) => (props.$is_show ? "block" : "hidden")}
`;
export const LoginButton = tw.button`
    flex justify-center items-center 
    max-md:px-4 md:px-10 max-md:py-1 md:py-2
    rounded-full max-md:bg-transparent
    md:bg-white/60 md:hover:bg-white/70
    text-black/70 text-base 
    max-md:font-semibold md:font-medium
    duration-200
`;

export const PageLayout = tw.div`
    flex flex-col items-center w-full
`;

export const LoginLayout = tw.div`
    absolute right-4 z-50
    ${(props: StyleProps) =>
      props.$is_show ? "max-md:top-13 md:top-14 opacity-100" : "top-8 opacity-0 pointer-events-none"}
    flex flex-center
    md:duration-200
`;

export const MobileNavLayout = tw.div`  
    absolute left-4 z-50
    ${(props: StyleProps) => (props.$is_show ? "top-13 opacity-100" : "top-8 opacity-0 pointer-events-none")}
    flex flex-center
    md:duration-200
`;
export const MobileNavContainer = tw.div`
    relative
    flex flex-col w-64 p-4
    rounded-lg bg-black/80
    drop-shadow-xl
    overflow-hidden
`;
export const MobileNavList = tw.div`
    flex flex-col w-full space-y-5
`;
export const MobileNavButton = tw.button`
    flex items-center
    font-medium text-stone-200
    [&>i]:w-8 [&>i]:mr-2
`;
