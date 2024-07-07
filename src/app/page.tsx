import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import dynamic from "next/dynamic"
import ApiUtils from "@/utils/ApiUtils"
import CommonUtils from "@/utils/CommonUtils"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(
    () => import("@/components/versus/VersusMainSearch"),
    { ssr: false },
)
const VersusList = dynamic(() => import("@/components/versus/VersusList"), {
    ssr: false,
})

const getGameList = async (search: string | undefined) => {
    let params = {}

    if (!CommonUtils.isStringNullOrEmpty(search)) {
        params["search"] = search
    }
    const [bResult, statusCode, response] = await ApiUtils.request(
        "/api/versus/game",
        "GET",
        params,
    )

    return response
}

export default async function Home({ params, searchParams }) {
    const search = searchParams.search ? searchParams.search : ""
    const gameData = await getGameList(search)

    return (
        <MainStyles.PageLayout>
            <VersusMainSearch />
            <VersusList versusGameData={gameData} />
        </MainStyles.PageLayout>
    )
}
