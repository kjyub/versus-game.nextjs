import { StyleProps } from "@/types/StyleTypes"
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

export const PageLayout = tw.div`
    flex flex-col items-center w-screen h-screen
    overflow-y-auto scroll-transparent
`

export const EditorLayout = tw.div`
    flex flex-col w-full p-4 mb-24 space-y-4
`
export const EditorDataLayout = tw.div`
    flex w-full
    max-lg:flex-col max-lg:space-y-4
    lg:flex-row lg:space-x-4
`
export const EditBox = tw.div`
    flex flex-col min-h-[32rem] max-h-[calc(100vh-192px)] p-4
    rounded-lg bg-black/20 backdrop-blur-sm
    overflow-y-auto scroll-transparent scroll-overlay
    [&>.title]:mb-2
    [&>.title]:font-medium [&>.title]:text-lg [&>.title]:text-stone-50
`
export const EditInfoBox = tw(EditBox)`
    flex flex-col flex-shrink-0 
    max-lg:w-full lg:min-w-[384px] lg:w-[30vw]
    space-y-4
`
export const EditChoiceBox = tw(EditBox)`
    flex flex-col w-full
`

export const EditorControlLayout = tw.div`
    flex justify-end w-full space-x-4
`
export const EditorControlButton = tw.button`
    flex flex-center px-7 py-3
    rounded-full backdrop-blur
    bg-black/40 hover:bg-black/60
    text-lg text-stone-100
    duration-200
`

export const InputContainer = tw.div`
    flex flex-col max-w-full
`
export const InputTitle = tw.span`
    font-light text-base text-stone-100
`
export const InputBox = tw.div`
    flex items-center w-full px-2 py-2
    rounded-md
    border border-slate-700/20
    ${(props: StyleProps) =>
        props.$disabled ? "bg-stone-800/20" : "bg-stone-800/20"}
    ${(props: StyleProps) =>
        props.$is_focus ? "border-slate-200/70 bg-stone-800/40" : ""}
    duration-200
    [&>.input]:w-full [&>.input]:bg-transparent
    [&>.input]:text-stone-100 [&>.input]:text-sm
    [&>.input]:outline-none focus:[&>.input]:outline-none
`
export const InputTypeButtonList = tw.div`
    flex flex-wrap space-x-1
`
export const InputTypeButton = tw.button`
    flex flex-center px-4 py-1.5
    rounded-full text-sm font-light
    ${(props: StyleProps) =>
        props.$is_show
            ? "bg-stone-800/50 text-stone-100"
            : "hover:bg-stone-800/20 text-stone-300"}
    duration-200
`

export const ThumbnailImageEditLayout = tw.div`
    flex w-full space-x-2
`
export const ThumbnailImageEditPreviewBox = tw.div`
    relative
    flex flex-center max-sm:w-full h-full
    text-stone-300
`
export const ThumbnailImageEditPreviewImageBox = tw.div`
    relative
    flex flex-center flex-shrink-0 h-full
    aspect-[4/3]
    rounded-md bg-black/30
    overflow-hidden [&>img]:object-cover
`
export const ThumbnailImageEditUploadBox = tw.div`
    flex flex-col w-full max-sm:h-11 sm:h-full space-y-2
`
export const ThumbnailImageEditUploadDragBox = tw.div`
    flex flex-center w-full h-full p-3
    rounded-md
    ${(props: StyleProps) =>
        props.$is_active ? "bg-black/20 animate-pulse" : "bg-transparent"}
    border-2 border-dashed border-stone-300
    text-stone-200 text-sm text-center
    duration-200
`
export const ThumbnailImageEditUploadButton = tw.label`
    flex flex-center flex-shrink-0 h-9
    rounded-md bg-stone-300/50 hover:bg-stone-300/70 backdrop-blur-sm
    text-sm text-stone-700
    cursor-pointer duration-200
`

export const ChoiceLayoutSettingContainer = tw.div`
    flex flex-center w-full min-h-[32rem]
    rounded-md 
`
export const ChoiceLayoutSettingGrid = tw.div`
    grid gap-2
    ${(props: any) =>
        props.$choice_count <= 2 ? "max-sm:grid-cols-1 sm:grid-cols-2" : ""}
    ${(props: any) =>
        props.$choice_count > 2 && props.$choice_count <= 3
            ? "max-sm:grid-cols-1 max-xl:grid-cols-2 xl:grid-cols-3"
            : ""}
    ${(props: any) =>
        props.$choice_count > 3
            ? "max-sm:grid-cols-1 max-xl:grid-cols-2 max-3xl:grid-cols-3 3xl:grid-cols-4"
            : ""}
    max-sm:w-full
    duration-300
`

export const ChoiceBox = tw.div`
    ${(props: StyleProps) => (props.$is_show ? "flex" : "hidden")}
    flex-col max-sm:w-full max-2xl:w-64 2xl:w-72
    rounded-md 
`
export const ChoiceThumbnailBox = tw.div`
    relative
    flex flex-col flex-center w-full aspect-[4/3]
    rounded-md bg-black/30
    text-stone-300
    overflow-hidden [&>img]:object-cover
`
export const ChoiceImageEditBox = tw.div`
    absolute z-10
    flex flex-col w-full h-full max-sm:px-4 max-sm:py-2 sm:px-12 sm:py-8
    ${(props: StyleProps) => (props.$is_active ? "bg-black/70" : "")}
`
export const ChoiceInfoBox = tw.div`
    flex flex-col w-full mt-2 space-y-2
    text-stone-300
`
export const ChoiceTitleBox = tw.div`
    flex items-center w-full px-3 py-2
    rounded-md bg-black/20
    text-stone-300
    ${(props: StyleProps) =>
        props.$is_focus ? "ring-1 ring-slate-200/70 bg-stone-800/20" : ""}
    duration-200
    [&>input]:bg-transparent [&>input]:text-stone-300
`

export const ListLayout = tw.div`
    flex flex-col p-4 w-full space-y-4
`
export const ListGrid = tw.div`
    grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-3xl:grid-cols-5 3xl:grid-cols-6
    w-full gap-4
`
export const ListGameBox = tw.div`
    flex flex-col w-full p-3
    rounded-md bg-black/30 backdrop-blur
    duration-300 [&.hover]:bg-black/40
`
export const ListGameThumbnailBox = tw.div`
    relative
    flex flex-col flex-center w-full aspect-[4/3]
    rounded-md bg-black/30
    text-stone-300
    overflow-hidden
    [&>img]:object-cover [&>img]:duration-300 [&>img.hover]:scale-110
`
export const ListGameContentBox = tw.div`
    flex flex-col w-full h-20 mt-2 space-y-1
    [&>.title]:font-semibold [&>.title]:text-stone-100
    [&>.content]:text-stone-300
`
export const ListGameControlBox = tw.div`
    flex justify-between items-center mt-auto
    [&>.box]:flex [&>.box]:items-center [&>.box]:space-x-1
`
export const ListGameControlButton = tw.button`
    flex flex-center px-2 py-0.5
    rounded-lg bg-stone-100/70 hover:bg-stone-100/90
    text-sm text-stone-700
    duration-200
`
