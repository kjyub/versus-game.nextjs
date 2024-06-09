import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import dynamic from "next/dynamic"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(
    () => import("@/components/versus/VersusMainSearch"),
    { ssr: false },
)

export default function Home() {
    return (
        <MainStyles.PageLayout>
            <VersusMainSearch />
        </MainStyles.PageLayout>
    )
}
