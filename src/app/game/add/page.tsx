import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VersusStyles from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import VersusEditor from "@/components/versus/VersusEditor"
import { Metadata, ResolvingMetadata } from "next"
import { SiteConsts } from "@/types/SiteTypes"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(
    () => import("@/components/versus/VersusMainSearch"),
    { ssr: false },
)


type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {
    let metaData: Metadata = {
        title: SiteConsts.SITE_TITLE,
        description: `VS게임을 만들어보세요 ${SiteConsts.SITE_TITLE}`,
        keywords: SiteConsts.SITE_KEYWORDS
    }

    return metaData
}


export default function GameAddPage() {
    return <VersusEditor />
}
