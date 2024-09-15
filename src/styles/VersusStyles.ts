import * as MainStyles from "@/styles/MainStyles"
import { StyleProps } from "@/types/StyleTypes"
import { ChoiceSelectStatus } from "@/types/VersusTypes"
import tw from "tailwind-styled-components"

export const ModalLayout = tw.div`
    flex flex-col p-4
    rounded-lg bg-white/70 backdrop-blur-lg

    [&>.title]:font-semibold [&>.title]:text-stone-700 [&>.title]:text-lg
`

export const MainSearchLayout = tw.div`
    flex flex-col max-sm:w-screen sm:w-128 px-4 space-y-2
`
export const MainSearchFilterMenuBox = tw.div`
    flex justify-between items-center w-full
    [&>div.section]:flex [&>div.section]:items-center [&>div.section]:space-x-1
`
export const MainSearchFilterMenuButton = tw.button`
    flex flex-center px-2 py-0.5
    rounded-md text-sm
    ${(props: StyleProps) => (props.$is_active ? "bg-stone-100/70 md:hover:bg-stone-100/90 text-stone-600" : "text-stone-300 bg-black/40 hover:bg-black/50")}
    duration-200
`

export const SearchInputBox = tw.div`
    flex items-center px-5 py-2
    rounded-full bg-black/50 backdrop-blur
    text-white/90

    [&>input]:w-full [&>input]:bg-transparent
    [&>i.clear]:ml-2 [&>i.clear]:mr-4 [&>i.clear]:text-stone-400 hover:[&>i.clear]:text-stone-300
    [&>i.search]:text-stone-300 hover:[&>i.search]:text-stone-100 [&>i.search]:text-lg
    [&>i]:cursor-pointer [&>i]:duration-200
`

export const PageLayout = tw(MainStyles.PageLayout)`
`

export const EditorLayout = tw.div`
    flex flex-col w-full max-md:p-2 md:p-4 mb-0 space-y-4
`
export const EditorDataLayout = tw.div`
    flex w-full
    max-lg:flex-col max-lg:space-y-4
    lg:flex-row lg:space-x-4
`
export const EditBox = tw.div`
    flex flex-col md:min-h-[32rem] md:max-h-[calc(100vh-192px)] max-sm:p-3 sm:p-4
    rounded-lg bg-black/20 backdrop-blur-sm
    overflow-x-hidden overflow-y-auto scroll-transparent scroll-overlay
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
    flex justify-between w-full space-x-4
`
export const EditorControlButton = tw.button`
    flex flex-center px-7 h-14
    rounded-full backdrop-blur
    bg-black/40 hover:bg-black/60
    text-lg text-stone-100
    duration-200
`
export const EditorPrivacySetButton = tw(EditorControlButton)`
    !justify-start w-36 space-x-3
    bg-black/30 hover:bg-black/40 
    [&>div>.title]:font-light [&>div>.title]:text-xs [&>div>.title]:text-stone-300
    [&>div>.value]:font-medium [&>div>.value]:text-sm [&>div>.value]:text-stone-100
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
    ${(props: StyleProps) => (props.$disabled ? "bg-stone-800/20" : "bg-stone-800/20")}
    ${(props: StyleProps) => (props.$is_focus ? "border-slate-200/70 bg-stone-800/40" : "")}
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
        props.$is_show ? "bg-stone-800/50 text-stone-100" : "hover:bg-stone-800/20 text-stone-300"}
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
    flex flex-center w-full h-full p-1
    rounded-md
    ${(props: StyleProps) => (props.$is_active ? "bg-black/20 animate-pulse" : "bg-transparent")}
    border-2 border-dashed border-stone-300
    text-stone-200 text-center
    max-md:text-xs md:text-sm
    duration-200
`
export const ThumbnailImageEditUploadButton = tw.label`
    flex flex-center flex-shrink-0 max-sm:h-7 sm:h-9
    rounded-md bg-stone-100/70 hover:bg-stone-100/90 backdrop-blur-sm
    max-sm:text-xs sm:text-sm text-stone-700
    cursor-pointer duration-200
`

export const ChoiceLayoutSettingContainer = tw.div`
    flex flex-center w-full max-md:min-h-[16rem] md:min-h-[32rem]
    rounded-md 
`
export const ChoiceLayoutSettingGrid = tw.div`
    z-10
    grid max-sm:gap-2 sm:gap-4
    ${(props: any) => (props.$choice_count <= 2 ? "max-sm:grid-cols-2 sm:grid-cols-2" : "")}
    ${(props: any) =>
        props.$choice_count > 2 && props.$choice_count <= 3
            ? "max-sm:grid-cols-2 max-xl:grid-cols-2 xl:grid-cols-3"
            : ""}
    ${(props: any) =>
        props.$choice_count > 3 ? "max-sm:grid-cols-2 max-xl:grid-cols-2 xl:grid-cols-3" : ""}
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
    flex flex-col w-full h-full max-sm:px-4 max-sm:py-4 sm:px-12 sm:py-8
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
    max-sm:text-sm sm:text-base
    ${(props: StyleProps) => (props.$is_focus ? "ring-1 ring-slate-200/70 bg-stone-800/20" : "")}
    duration-200
    [&>input]:bg-transparent [&>input]:text-stone-300
`

export const ListLayout = tw.div`
    flex flex-col p-4 w-full space-y-4
`
export const ListScrollTopButton = tw.button`
    absolute max-md:bottom-4 max-md:right-4 md:bottom-8 md:right-8
    flex flex-center w-10 h-10
    border border-blue-500/50
    rounded-full bg-blue-400/60 backdrop-blur
    text-white
`
export const ListGrid = tw.div`
    grid max-sm:grid-cols-2 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-3xl:grid-cols-5 3xl:grid-cols-6
    max-sm:gap-2 sm:gap-4
    w-full 
`
export const ListGameBox = tw.div`
    flex flex-col w-full max-sm:p-2 sm:p-3
    rounded-lg bg-black/30 backdrop-blur
    duration-300 [&.hover]:bg-black/40
`
export const ListGameLoadingBox = tw(ListGameBox)`
    h-40
    ${(props: StyleProps) => (props.$is_active ? "animate-pulse opacity-100" : "opacity-0")}
`
export const ListGameThumbnailBox = tw.div`
    relative
    flex flex-col flex-center w-full aspect-[4/3]
    rounded-md bg-stone-800/20
    max-sm:text-xs text-stone-500
    overflow-hidden
    [&>img]:object-cover [&>img]:duration-300 [&>img.hover]:scale-110
`
export const ListGameContentBox = tw.div`
    flex flex-col w-full h-20 mt-1 space-y-1
    [&>.title]:flex [&>.title]:items-center [&>.title]:w-full [&>.title]:font-medium [&>.title]:text-stone-100 
    max-sm:[&>.title]:text-sm sm:[&>.title]:text-base
    [&>.title.viewed]:text-stone-400
    [&>.content]:font-light [&>.content]:text-xs [&>.content]:text-stone-300
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

export const ListGameSimpleBox = tw(ListGameBox)`
    relative flex-row !p-0
    w-full h-20
    overflow-hidden
`
export const ListGameSimpleContentBox = tw.div`
    absolute z-10 
    flex flex-col w-full h-full mt-0 max-sm:px-2 sm:px-3 max-sm:py-1 sm:py-2
    backdrop-blur
    ${(props: StyleProps) => (props.$is_active ? "bg-black/30" : "bg-rose-800/50")}
`


export const ListGamePrivacy = tw.div`
    flex items-center space-x-2
    text-sm text-stone-200
`

export const GameViewLayout = tw.div`
    flex flex-col items-center w-full max-w-[60rem] p-2 pb-16 mx-auto space-y-4
`
export const GameViewSectionLayoutSize = tw.div`
    w-full p-4
`
export const GameViewHeadLayout = tw(GameViewSectionLayoutSize)`
    flex flex-col space-y-2
    rounded-md bg-black/30 backdrop-blur
    duration-300

    [&>.title]:text-center [&>.title]:text-xl [&>.title]:font-semibold [&>.title]:text-stone-100
    [&>.content]:text-stone-300
`
export const GameViewChoiceLayout = tw(GameViewSectionLayoutSize)`
    z-0
    flex flex-col items-center max-sm:min-h-[16rem] sm:min-h-[32rem] p-0
    overflow-y-auto scroll-transparent scroll-overlay
    overflow-visible
`
    // max-h-[calc(100vh-192px)]
export const GameViewChoiceThumbnailBox = tw(ChoiceThumbnailBox)`
    ${(props: any) => (props.$status === ChoiceSelectStatus.WAIT ? "" : "")}
    ${(props: any) =>
        props.$status === ChoiceSelectStatus.SELECTED
            ? "ring-[3px] ring-indigo-500 [&>img]:scale-110"
            : "[&>img]:hover:scale-110"}
    ${(props: any) => (props.$status === ChoiceSelectStatus.UNSELECTED ? "[&>.content]:bg-black/30" : "")}
    duration-300 [&>img]:duration-300
`
export const ChoiceImageContentBox = tw.div`
    absolute z-10
    flex flex-col w-full h-full max-sm:px-4 max-sm:py-2 sm:px-4 sm:py-2
    duration-300
    hover:drop-shadow

    [&>.title]:font-medium [&>.title]:text-center [&>.title]:text-white 
    max-sm:[&>.title]:text-lg max-lg:[&>.title]:text-xl sm:[&>.title]:text-2xl 
`
export const GameViewChoiceResultBox = tw.div`
    absolute z-10
    ${(props: StyleProps) => (props.$is_show ? "max-sm:bottom-2 sm:bottom-4" : "-bottom-8")}
    flex items-center px-1 py-1
    sm:divide-x divide-stone-300
    rounded-full bg-white/80 backdrop-blur
    font-medium text-rose-600 max-sm:text-xs sm:text-sm
    duration-300
    max-sm:[&>div]:px-1 sm:[&>div]:px-2
`

export const GameViewSelectLayout = tw(GameViewSectionLayoutSize)`
    flex flex-row items-center h-12 space-x-2 py-0
    [&>button]:h-full [&>button]:rounded-full
    [&>button]:font-medium [&>button]:text-white
    [&>button]:backdrop-blur [&>button]:duration-300
    disabled:[&>button]:grayscale disabled:[&>button]:text-stone-300
`

export const GameViewCommentLayout = tw(GameViewSectionLayoutSize)`
    ${(props: StyleProps) => (props.$is_show ? "flex opacity-100" : "hidden opacity-0")}
    flex-col space-y-4
    rounded-md bg-black/40 backdrop-blur
    duration-500
    [&>.title]:font-semibold [&>.title]:text-stone-100
`
export const GameViewCommentList = tw.div`
    flex flex-col w-full space-y-2
`
export const GameViewCommentBox = tw.div`
    flex flex-col w-full p-3
    rounded-md bg-black/20
`
export const GameViewCommentInputBox = tw.div`
    flex items-start w-full px-2 py-2 space-x-1
    rounded-md bg-black/40
    border border-stone-500
    ${(props: StyleProps) => (props.$is_focus ? "border-stone-200/70" : "")}
    duration-200
    
    [&>textarea]:flex-1 [&>textarea]:p-1 [&>textarea]:resize-none
    [&>textarea]:bg-transparent [&>textarea]:text-stone-300
`
export const GameViewCommentInputButton = tw.button`
    px-3 py-1 rounded-md 
    ${(props: StyleProps) => (props.$is_active ? "text-rose-500 hover:text-rose-600" : "text-stone-400")}
    font-semibold 
    duration-200
`
export const GameViewCommentEditButton = tw.button`
    px-2 py-1
    rounded-md text-sm
    ${(props: StyleProps) => (props.$is_active ? "bg-stone-100/80 hover:bg-stone-100 text-rose-500" : "hover:bg-black/20 text-stone-400")}
    duration-200
`

export const CommentPaginationBox = tw.div`
    flex items-center space-x-2
`
export const CommentPaginationButton = tw.button`
    flex flex-center p-2 w-9 h-9
    rounded-full
    text-stone-300
    duration-200
    ${(props: StyleProps) => (props.$is_active ? "bg-black/30" : "bg-transparent hover:bg-black/20")}
`

export const GameViewRelatedLayout = tw(GameViewSectionLayoutSize)`
    ${(props: StyleProps) => (props.$is_show ? "flex opacity-100" : "hidden opacity-0")}
    flex-col p-0 space-y-4
`
export const GameViewRelatedList = tw.div`
    max-sm:grid max-sm:grid-cols-2 max-sm:gap-2
    max-sm:overflow-y-auto
    sm:flex sm:flex-row sm:space-x-3
    w-full sm:pb-1
    sm:overflow-x-scroll scroll-transparent scroll-overlay
    sm:[&>div]:min-w-[12rem]
`


export const PrivacyModalLayout = tw(ModalLayout)`
    max-sm:w-[90vw] sm:w-96
`
export const PrivacyModalItem = tw.div`
    flex items-center w-full p-3 space-y-0
    rounded-lg border border-transparent
    ${(props: StyleProps) => (props.$is_active ? "bg-stone-200/70 border-stone-400" : "bg-transparent hover:bg-stone-200/60")}
    duration-200 cursor-pointer
    
    [&>i]:flex [&>i]:justify-center [&>i]:items-center [&>i]:h-10 [&>i]:aspect-square [&>i]:mr-2 
    [&>i]:text-xl [&>i]:text-stone-600
    [&>.info]:flex [&>.info]:flex-col
    [&>.info>.title]:font-medium [&>.info>.title]:text-stone-600 [&>.info>.title]:text-lg
    [&>.info>.content]:font-light [&>.info>.content]:text-stone-500 [&>.info>.content]:text-sm
`