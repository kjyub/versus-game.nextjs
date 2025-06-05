import * as MainStyles from '@/styles/MainStyles';
import type { StyleProps } from '@/types/StyleTypes';
import { ChoiceSelectStatus } from '@/types/VersusTypes';
import tw from 'tailwind-styled-components';

export const ModalLayout = tw.div`
    flex flex-col p-4
    rounded-lg bg-white/70 backdrop-blur-lg

    [&>.title]:font-semibold [&>.title]:text-stone-700 [&>.title]:text-lg
`;

export const MainTitleLayout = tw.div`
    sticky max-md:top-14 md:top-16 z-10
    flex flex-col flex-center w-full max-md:my-20 md:my-64
    duration-500
`;
export const MainSearchLayout = tw.div`
    relative z-10
    flex flex-col max-sm:w-[80vw] sm:w-128 max-md:p-2 md:p-4 space-y-2
`;
export const MainSearchFilterMenuBox = tw.div`
    flex justify-between items-center w-full
    [&>div.section]:flex [&>div.section]:items-center [&>div.section]:space-x-1
    ${({ $is_show }: StyleProps) => ($is_show ? 'opacity-100' : 'opacity-0')}
    duration-200
`;
export const MainSearchFilterMenuButton = tw.button`
    flex flex-center px-2 py-0.5
    rounded-md text-sm
    ${(props: StyleProps) =>
      props.$is_active
        ? 'bg-stone-100/70 md:hover:bg-stone-100/90 text-stone-600'
        : 'text-stone-300 layer-bg-2 layer-hover'}
    duration-200
`;

export const SearchInputBox = tw.div`
    flex items-center px-6 py-4
    rounded-full layer-bg-3 backdrop-blur-sm
    text-white/90

    [&>input]:w-full [&>input]:bg-transparent
    [&>i.clear]:ml-2 [&>i.clear]:mr-4 [&>i.clear]:text-stone-400 [&>i.clear]:hover:text-stone-300
    [&>i.search]:text-stone-300 [&>i.search]:hover:text-stone-100 [&>i.search]:text-lg
    [&>i]:cursor-pointer [&>i]:duration-200
`;

export const PageLayout = tw(MainStyles.PageLayout)`
`;

export const EditorLayout = tw.div`
    flex flex-col max-sm:w-full max-md:p-2 md:p-4 mb-0 space-y-4
`;
export const EditorDataLayout = tw.div`
    flex w-full md:h-[35rem]
    max-md:flex-col md:flex-row gap-4
`;
export const EditBox = tw.div`
    flex flex-col max-sm:w-full sm:w-84 lg:w-96 md:h-full max-sm:p-3 sm:p-4
    rounded-xl layer-bg backdrop-blur-xs
    [&>.title]:mb-2
    [&>.title]:font-medium [&>.title]:text-lg [&>.title]:text-stone-50
`;
export const EditInfoBox = tw(EditBox)`
    flex flex-col shrink-0 
    max-lg:w-full lg:min-w-[384px] lg:w-[30vw]
    space-y-4
`;
export const EditChoiceBox = tw(EditBox)`
    flex flex-col w-full
`;

export const EditorControlLayout = tw.div`
    flex justify-between w-full space-x-4
`;
export const EditorControlButton = tw.button`
    flex flex-center px-7 h-14
    rounded-full backdrop-blur-sm
    layer-bg-2 layer-hover
    text-lg text-stone-100
    duration-200
`;
export const EditorPrivacySetButton = tw(EditorControlButton)`
    !justify-start w-36 space-x-3
    layer-bg layer-hover
    [&>div>.title]:font-light [&>div>.title]:text-xs [&>div>.title]:text-stone-300
    [&>div>.value]:font-medium [&>div>.value]:text-sm [&>div>.value]:text-stone-100
`;

export const InputContainer = tw.div`
    flex flex-col max-w-full
`;
export const InputTitle = tw.span`
    font-normal text-base text-stone-100
`;
export const InputBox = tw.div`
    flex items-center w-full px-2 py-2
    rounded-md
    border border-slate-700/20
    ${(props: StyleProps) => (props.$disabled ? 'bg-stone-800/20' : 'bg-stone-800/20')}
    ${(props: StyleProps) => (props.$is_focus ? 'border-slate-200/70 bg-stone-800/40' : '')}
    duration-200
    [&>.input]:w-full [&>.input]:bg-transparent
    [&>.input]:text-stone-100 [&>.input]:text-sm
    [&>.input]:outline-hidden [&>.input]:focus:outline-hidden
`;
export const InputTypeButtonList = tw.div`
    flex flex-wrap space-x-1
`;
export const InputTypeButton = tw.button`
    flex flex-center px-4 py-1.5
    rounded-full text-sm font-light
    ${(props: StyleProps) =>
      props.$is_show ? 'bg-stone-800/50 text-stone-100' : 'hover:bg-stone-800/20 text-stone-300'}
    duration-200
`;

export const ThumbnailImageEditLayout = tw.div`
    flex w-full space-x-2
`;
export const ThumbnailImageEditPreviewBox = tw.div`
    relative
    flex flex-center w-full
    text-stone-300
`;
export const ThumbnailImageEditPreviewImageBox = tw.div`
    relative
    flex flex-center w-full max-w-[384px] max-h-[288px]
    aspect-4/3
    rounded-md layer-bg
    overflow-hidden [&>img]:object-cover
`;
export const ThumbnailImageEditUploadBox = tw.div`
    flex flex-col w-full gap-2
`;
export const ThumbnailImageEditUploadDragBox = tw.div`
    flex flex-center w-full h-32 p-1
    rounded-md
    ${(props: StyleProps) => (props.$is_active ? 'layer-bg-1/2 animate-pulse' : 'bg-transparent')}
    border-2 border-dashed border-stone-300
    text-stone-200 text-center
    max-md:text-xs md:text-sm
    duration-200
`;
export const ThumbnailImageEditUploadButton = tw.label`
    flex flex-center shrink-0 max-sm:h-7 sm:h-9
    rounded-md bg-stone-100/70 hover:bg-stone-100/90 backdrop-blur-xs
    max-sm:text-xs sm:text-sm text-stone-700
    cursor-pointer duration-200
`;

export const ChoiceLayoutSettingContainer = tw.div`
    flex flex-col w-full gap-2
    rounded-md 
`;
export const ChoiceLayoutSettingGrid = tw.div`
    z-10
    grid max-sm:gap-2 max-sm:grid-cols-1 sm:grid-cols-2 sm:gap-4
    max-sm:w-full sm:w-136
    duration-300
`;

export const ChoiceBox = tw.div`
    relative
    flex flex-col items-center w-full
    rounded-xl
    overflow-hidden
`;
export const ChoiceThumbnailBox = tw.div`
    relative
    flex flex-col flex-center w-full
    rounded-xl layer-bg
    text-stone-300
    overflow-hidden [&>img]:object-cover
`;
export const ChoiceImageEditBox = tw.div`
    absolute z-10
    flex flex-col w-full h-full max-sm:px-4 max-sm:py-4 sm:px-12 sm:py-8
    ${(props: StyleProps) => (props.$is_active ? 'layer-bg-4' : '')}
`;
export const ChoiceInfoBox = tw.div`
    flex flex-col w-full space-y-2
    text-stone-300
`;
export const ChoiceTitleBox = tw(ChoiceBox)`
    px-3 py-2
    layer-bg-1/2
    text-sm text-stone-300
    border border-transparent
    ${(props: StyleProps) => (props.$is_focus ? 'border-slate-200/70' : '')}
    ${(props: StyleProps) => (props.$is_active ? '!bg-blue-500/20' : '')}
    transition-colors will-change-transform
    [&>input]:w-full
    [&>input]:bg-transparent [&>input]:text-stone-300
`;
export const ChoiceAddBox = tw.button`
  w-full h-10
  rounded-md layer-bg layer-hover
  text-stone-300 text-sm
  duration-200
`;

export const ListLayout = tw.div`
    flex flex-col items-center w-full max-w-200 max-md:p-4 md:p-4 space-y-4
`;
export const ListScrollTopButton = tw.button`
    fixed max-md:bottom-4 max-md:right-4 md:bottom-8 md:right-8
    flex flex-center w-10 h-10
    border border-black/50
    rounded-full layer-bg-4 backdrop-blur-sm
    text-white/70
`;
export const ListGrid = tw.div`
    grid max-sm:grid-cols-1 sm:grid-cols-2
    max-md:gap-4 md:gap-4
`;

export const ListGameBox = tw.div`
    flex flex-col w-full max-sm:p-3 sm:p-3 gap-2 [&>a]:flex [&>a]:flex-col [&>a]:gap-2
    rounded-xl layer-bg layer-hover backdrop-blur-sm
    duration-300
`;
export const ListGameLoadingBox = tw(ListGameBox)`
    h-40
    ${(props: StyleProps) => (props.$is_active ? 'animate-pulse opacity-100' : 'opacity-0')}
`;
export const ListGameContentBox = tw.div`
    flex flex-col w-full space-y-1

    [&>.title]:flex [&>.title]:items-center [&>.title]:w-full 
    [&>.title]:text-base [&>.title]:font-semibold [&>.title]:text-stone-100 
    [&>.title.viewed]:text-stone-400

    [&>.content]:font-normal [&>.content]:text-xs [&>.content]:text-stone-300
    [&>.content]:line-clamp-2
    [&>.content]:h-8
`;
export const ListGameControlBox = tw.div`
    flex justify-between items-center mt-auto
    [&>.box]:flex [&>.box]:items-center [&>.box]:space-x-1
`;
export const ListGameChoiceBox = tw.div`
  flex sm:pb-1 gap-1
  font-light
  overflow-x-scroll scroll-transparent scroll-overlay
  [&>.box]:flex [&>.box]:shrink-0 [&>.box]:px-1 [&>.box]:py-0.5
  [&>.box]:rounded-md [&>.box]:bg-black/30
  [&>.box]:text-xs [&>.box]:text-stone-300
  [&>.box>.index]:mr-1 [&>.box>.index]:font-semibold
`;
export const ListGameChoiceMask = tw.div`
  absolute top-0 w-16 h-5 bg-gradient-to-r from-black/50 to-transparent
  pointer-events-none
  ${(props: StyleProps) => (props.$is_show ? 'opacity-100' : 'opacity-0')}
  duration-300
`;
export const ListGameControlButton = tw.button`
    flex flex-center px-2 py-0.5
    rounded-lg bg-stone-100/70 hover:bg-stone-100/90
    text-sm text-stone-700
    duration-200
`;

export const ListGameSimpleBox = tw(ListGameBox)`
    relative flex-row !p-0
    w-full h-20
    overflow-hidden
`;
export const ListGameSimpleContentBox = tw.div`
    absolute z-10 
    flex flex-col w-full h-full mt-0 max-sm:px-3 sm:px-3 max-sm:py-2 sm:py-2
    backdrop-blur-sm
`;

export const ListGamePrivacy = tw.div`
    flex items-center space-x-2
    text-sm text-stone-200
`;

export const GameViewLayout = tw.div`
    flex flex-col items-center w-full max-w-[800px] p-3 pb-16 mx-auto space-y-4
`;
export const GameViewSectionLayoutSize = tw.div`
    w-full max-md:p-4 md:p-6
`;
export const GameViewHeadLayout = tw(GameViewSectionLayoutSize)`
    flex flex-col space-y-2
    rounded-xl layer-bg backdrop-blur-sm
    duration-300

    [&>.title]:text-center [&>.title]:text-xl [&>.title]:font-semibold [&>.title]:text-stone-100
    [&>.content]:text-stone-300
`;
export const GameViewChoiceLayout = tw(GameViewSectionLayoutSize)`
    z-0
    flex flex-col items-center max-sm:min-h-[16rem] sm:min-h-[32rem] p-0
    overflow-y-auto scroll-transparent scroll-overlay
    overflow-visible
`;
// max-h-[calc(100vh-192px)]
export const GameViewChoiceThumbnailBox = tw(ChoiceThumbnailBox)` 
  [&>img]:duration-300
`;
export const GameViewChoiceContentBox = tw.div`
  flex flex-col w-full pb-10
  ${(props: any) => (props.$status === ChoiceSelectStatus.WAIT ? '' : '')}
  ${(props: any) => (props.$status === ChoiceSelectStatus.SELECTED ? 'border-indigo-500' : 'border-transparent')}
  ${(props: any) => (props.$status === ChoiceSelectStatus.UNSELECTED ? 'layer-bg-4' : 'layer-bg')}
  rounded-xl border-3 duration-300
  max-sm:[&>.title]:py-2 sm:[&>.title]:py-4
  [&>.title]:font-medium [&>.title]:text-center [&>.title]:text-white 
  max-sm:[&>.title]:text-lg max-lg:[&>.title]:text-xl sm:[&>.title]:text-xl 
`;
export const ChoiceImageContentBox = tw.div`
    absolute z-10
    flex flex-col w-full pb-20 max-sm:px-4 max-sm:py-2 sm:px-4 sm:py-2
    duration-300
    hover:drop-shadow-sm
`;
export const GameViewChoiceResultBox = tw.div`
    absolute z-10
    ${(props: StyleProps) => (props.$is_show ? 'max-sm:bottom-4 sm:bottom-4' : '-bottom-8')}
    flex items-center px-1 py-1
    sm:divide-x divide-stone-300
    rounded-full bg-white/80 backdrop-blur-sm
    font-medium text-rose-600 max-sm:text-xs sm:text-sm
    duration-300
    max-sm:[&>div]:px-1 sm:[&>div]:px-2
`;

export const GameViewSelectLayout = tw(GameViewSectionLayoutSize)`
    flex flex-row items-center space-x-2 py-0
    [&>button]:h-12 [&>button]:rounded-full
    [&>button]:font-medium [&>button]:text-white
    [&>button]:backdrop-blur-sm [&>button]:duration-300
    [&>button]:disabled:grayscale [&>button]:disabled:text-stone-300
`;

export const GameViewCommentLayout = tw(GameViewSectionLayoutSize)`
    ${(props: StyleProps) => (props.$is_show ? 'flex opacity-100' : 'hidden opacity-0')}
    flex-col space-y-4
    rounded-xl layer-bg backdrop-blur-sm
    duration-500
    [&>.title]:text-lg [&>.title]:font-semibold [&>.title]:text-stone-100 [&>.title]:leading-[100%]
`;
export const GameViewCommentList = tw.div`
    flex flex-col w-full
`;
export const GameViewCommentBox = tw.div`
    flex flex-col w-full py-2 gap-1
`;
export const GameViewCommentInputBox = tw.div`
    flex flex-col items-start w-full px-2 py-2 gap-1
    rounded-lg layer-bg-2
    ${(props: StyleProps) => (props.$is_focus ? 'border-stone-200/70' : '')}
    duration-200
    
    [&_textarea]:w-full [&_textarea]:p-1 [&_textarea]:resize-none
    [&_textarea]:bg-transparent [&_textarea]:text-stone-300
`;
export const GameViewCommentInputButton = tw.button`
    px-3 py-1 rounded-md 
    ${(props: StyleProps) => (props.$is_active ? 'text-rose-500 hover:text-rose-600' : 'text-stone-400')}
    font-semibold 
    duration-200
`;
export const GameViewCommentEditButton = tw.button`
    px-2 py-1
    rounded-md text-sm
    ${(props: StyleProps) =>
      props.$is_active
        ? 'bg-stone-100/80 hover:bg-stone-100 text-rose-500'
        : 'layer-bg-transparent layer-hover text-stone-300'}
    duration-200
`;

export const CommentPaginationBox = tw.div`
    flex items-center space-x-2
`;
export const CommentPaginationButton = tw.button`
    flex flex-center p-2 w-9 h-9
    rounded-full
    text-stone-300
    duration-200
    ${(props: StyleProps) => (props.$is_active ? 'layer-bg' : 'layer-bg-transparent layer-hover')}
`;

export const GameViewRelatedLayout = tw(GameViewSectionLayoutSize)`
    ${(props: StyleProps) => (props.$is_show ? 'flex opacity-100' : 'hidden opacity-0')}
    flex-col max-md:p-0 md:p-0 space-y-4
`;
export const GameViewRelatedList = tw.div`
    max-sm:grid max-sm:grid-cols-2 max-sm:gap-2
    max-sm:overflow-y-auto
    sm:flex sm:flex-row sm:space-x-3
    w-full sm:pb-1
    sm:overflow-x-scroll scroll-transparent scroll-overlay
    sm:[&>div]:min-w-[12rem]
`;

export const PrivacyModalLayout = tw(ModalLayout)`
  max-sm:w-[90vw] sm:w-96
`;
export const PrivacyModalItem = tw.div`
    flex items-center w-full p-3 space-y-0
    rounded-lg border border-transparent
    ${(props: StyleProps) =>
      props.$is_active ? 'bg-stone-200/70 border-stone-400' : 'bg-transparent hover:bg-stone-200/60'}
    duration-200 cursor-pointer
    
    [&>i]:flex [&>i]:justify-center [&>i]:items-center [&>i]:h-10 [&>i]:aspect-square [&>i]:mr-2 
    [&>i]:text-xl [&>i]:text-stone-600
    [&>.info]:flex [&>.info]:flex-col
    [&>.info>.title]:font-medium [&>.info>.title]:text-stone-600 [&>.info>.title]:text-lg
    [&>.info>.content]:font-light [&>.info>.content]:text-stone-500 [&>.info>.content]:text-sm
`;

export const ShareBox = tw.div`
    relative
    flex justify-between items-center w-10 hover:w-[230px] h-10 px-3 py-1 space-x-1
    rounded-full layer-bg-transparent layer-hover
    duration-300 cursor-pointer

    [&>.icon]:absolute [&>.icon]:top-2.5 [&>.icon]:right-3 [&>.icon]:z-10
    [&>.icon]:w-4
`;
export const ShareButton = tw.button`
    flex items-center px-2 py-1 space-x-1
    rounded-full layer-bg-transparent layer-hover
    text-sm *:text-stone-200
    text-nowrap
    transition-colors

    [&>i]:text-xs
`;
export const ShareMessage = tw.div`
    absolute right-0
    ${({ $is_show }: StyleProps) => ($is_show ? '-top-6 opacity-100 z-10' : '-top-3 opacity-0 -z-10')}
    flex items-center justify-center px-3 py-1
    rounded-full
    !text-stone-200 text-nowrap text-xs
    !overflow-visible duration-200
`;

export const ShareEmbedModalLayout = tw(ModalLayout)`
    layer-bg
    [&>.title]:text-stone-200
`;
export const ShareEmbedModalMessage = tw.div`
    absolute right-0
    ${({ $is_show }: StyleProps) => ($is_show ? 'top-0.5 opacity-100 z-10' : 'top-6 opacity-0 -z-10')}
    !text-stone-200 text-nowrap text-xs
    duration-200
`;
