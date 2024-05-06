import { NoteTagColorTypes } from "@/types/MemoTypes"
import tw from "tailwind-styled-components"

export const NoteTagColor = tw.div`
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.SLATE
            ? "bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-slate-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.STONE
            ? "bg-stone-300 text-stone-800 dark:bg-stone-600 dark:text-stone-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.RED
            ? "bg-red-300 text-red-800 dark:bg-red-600 dark:text-red-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.ORANGE
            ? "bg-orange-300 text-orange-800 dark:bg-orange-600 dark:text-orange-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.AMBER
            ? "bg-amber-300 text-amber-800 dark:bg-amber-600 dark:text-amber-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.YELLOW
            ? "bg-yellow-300 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.LIME
            ? "bg-lime-300 text-lime-800 dark:bg-lime-600 dark:text-lime-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.GREEN
            ? "bg-green-300 text-green-800 dark:bg-green-600 dark:text-green-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.EMERALD
            ? "bg-emerald-300 text-emerald-800 dark:bg-emerald-600 dark:text-emerald-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.TEAL
            ? "bg-teal-300 text-teal-800 dark:bg-teal-600 dark:text-teal-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.CYAN
            ? "bg-cyan-300 text-cyan-800 dark:bg-cyan-600 dark:text-cyan-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.SKY
            ? "bg-sky-300 text-sky-800 dark:bg-sky-600 dark:text-sky-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.BLUE
            ? "bg-blue-300 text-blue-800 dark:bg-blue-600 dark:text-blue-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.INDIGO
            ? "bg-indigo-300 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.VIOLET
            ? "bg-violet-300 text-violet-800 dark:bg-violet-600 dark:text-violet-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.PURPLE
            ? "bg-purple-300 text-purple-800 dark:bg-purple-600 dark:text-purple-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.FUCHSIA
            ? "bg-fuchsia-300 text-fuchsia-800 dark:bg-fuchsia-600 dark:text-fuchsia-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.PINK
            ? "bg-pink-300 text-pink-800 dark:bg-pink-600 dark:text-pink-200"
            : ""}
    ${(props: any) =>
        props.$tag_color == NoteTagColorTypes.ROSE
            ? "bg-rose-300 text-rose-800 dark:bg-rose-600 dark:text-rose-200"
            : ""}
`
