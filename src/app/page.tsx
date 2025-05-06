import { auth } from "@/auth";
import VersusList from "@/components/versus/VersusList";
import VersusMainTitle from "@/components/versus/VersusMainTitle";
import * as MainStyles from "@/styles/MainStyles";
import { IPaginationResponse } from "@/types/common/Responses";
import ApiUtils from "@/utils/ApiUtils";
import AuthUtils from "@/utils/AuthUtils";
import CommonUtils from "@/utils/CommonUtils";

const getGameList = async (search: string | undefined, myGames: boolean, choiced: boolean, userId: string) => {
  let params = {};

  if (search) {
    params["search"] = search;
  }
  if (myGames) {
    params["myGames"] = 1;
  }
  if (choiced) {
    params["choiced"] = 1;
  }
  if (userId) {
    params["userId"] = userId;
  }

  const { data } = await ApiUtils.request("/api/versus/game", "GET", { params });

  return data;
};

export default async function Home(props) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const userId: string = await AuthUtils.getUserOrGuestIdBySSR(session);

  const search: string = searchParams.search ? searchParams.search : "";
  const myGames: boolean = searchParams.myGames ? true : false;
  const choiced: boolean = searchParams.choiced ? true : false;
  const gamePaginationData: IPaginationResponse = await getGameList(search, myGames, choiced, userId);

  return (
    <MainStyles.PageLayout id="game-list-page">
      <VersusMainTitle />
      <VersusList versusGameData={gamePaginationData} />
    </MainStyles.PageLayout>
  );
}
