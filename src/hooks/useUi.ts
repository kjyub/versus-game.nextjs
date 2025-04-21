import { UiContext } from "@/stores/contexts/UiProvider"
import { useContext } from "react"

export const useUi = () => {
    const { isScrollTop } = useContext(UiContext)

    return { isScrollTop }
}
