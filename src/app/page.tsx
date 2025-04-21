import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import dynamic from "next/dynamic"
import ApiUtils from "@/utils/ApiUtils"
import CommonUtils from "@/utils/CommonUtils"
import { auth } from "@/auth"
import { IPaginationResponse } from "@/types/common/Responses"
import AuthUtils from "@/utils/AuthUtils"
import { cookies } from "next/headers"

const VersusMainTitle = dynamic(
    () => import("@/components/versus/VersusMainTitle"),
    { ssr: false },
)
const VersusList = dynamic(() => import("@/components/versus/VersusList"), {
    ssr: false,
})

const getGameList = async (search: string | undefined, myGames: boolean, choiced: boolean, userId: string) => {
    let params = {}

    if (!CommonUtils.isStringNullOrEmpty(search)) {
        params["search"] = search
    }
    if (myGames) {
        params["myGames"] = 1
    }
    if (choiced) {
        params["choiced"] = 1
    }
    if (!CommonUtils.isStringNullOrEmpty(userId)) {
        params["userId"] = userId
    }

    const [bResult, statusCode, response] = await ApiUtils.request(
        "/api/versus/game",
        "GET",
        params,
    )

    // if (!Array.isArray(response)) {
    //     return []
    // }

    return response
}

export default async function Home({ params, searchParams }) {
    const session = await auth()
    const userId: string = AuthUtils.getUserOrGuestIdBySSR(session)

    const search: string = searchParams.search ? searchParams.search : ""
    const myGames: boolean = searchParams.myGames ? true : false
    const choiced: boolean = searchParams.choiced ? true : false
    const gamePaginationData: IPaginationResponse = await getGameList(search, myGames, choiced, userId)

    return (
        <MainStyles.PageLayout id="game-list-page">
            <VersusMainTitle />
            <VersusList versusGameData={gamePaginationData} />
        </MainStyles.PageLayout>
    )
}
