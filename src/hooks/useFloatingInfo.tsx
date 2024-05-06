import { create } from "zustand"

interface FloatingInfoState {
    noteRefreshFlag: boolean
}

interface FloatingInfoActions {
    activeNoteRefresh: () => void
}

const defaultState = { noteRefreshFlag: false }

const useFloatingInfo = create<FloatingInfoState & FloatingInfoActions>(
    (set) => ({
        ...defaultState,
        activeNoteRefresh: () => {
            set(() => ({ noteRefreshFlag: true }))
            setTimeout(() => {
                set({ noteRefreshFlag: false })
            }, 1000)
        },
        // setFloatingInfo: (floatingInfo: floatingInfoType) => {set({ floatingInfo })},
        // deleteFloatingInfo: () => {set({floatingInfo: defaultState})}
    }),
)

export default useFloatingInfo
