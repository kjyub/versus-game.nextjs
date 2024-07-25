import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import dynamic from "next/dynamic"
import ApiUtils from "@/utils/ApiUtils"
import CommonUtils from "@/utils/CommonUtils"
import { auth } from "@/auth"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(
    () => import("@/components/versus/VersusMainSearch"),
    { ssr: false },
)
const VersusList = dynamic(() => import("@/components/versus/VersusList"), {
    ssr: false,
})

const getGameList = async (search: string | undefined, myGames: string | undefined, userId: string) => {
    let params = {}

    if (!CommonUtils.isStringNullOrEmpty(search)) {
        params["search"] = search
    }
    if (!CommonUtils.isStringNullOrEmpty(myGames)) {
        params["myGames"] = 1
    }
    if (!CommonUtils.isStringNullOrEmpty(userId)) {
        params["userId"] = userId
    }

    const [bResult, statusCode, response] = await ApiUtils.request(
        "/api/versus/game",
        "GET",
        params,
    )

    if (!Array.isArray(response)) {
        return []
    }

    return response
}

export default async function Home({ params, searchParams }) {
    const session = await auth()
    let userId: string = ""
    if (!CommonUtils.isNullOrUndefined(session)) {
        userId = session?.user._id
    }

    const search = searchParams.search ? searchParams.search : ""
    const myGames = searchParams.myGames ? searchParams.myGames : ""
    const gameData = await getGameList(search, myGames, userId)

    return (
        <MainStyles.PageLayout>
            <VersusMainSearch />
            <VersusList versusGameData={gameData} />
        </MainStyles.PageLayout>
    )
}
