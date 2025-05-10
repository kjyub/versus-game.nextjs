import { auth } from "@/auth";
import VersusGameEmbedView from "@/components/versus/VersusGameEmbedView";
import ApiUtils from "@/utils/ApiUtils";
import AuthUtils from "@/utils/AuthUtils";

const getGame = async (gameId: string, userId: string) => {
  let params = {};

  if (userId) {
    params["userId"] = userId;
  }

  const { data } = await ApiUtils.request(`/api/versus/game/${gameId}`, "GET", { params });

  return data;
};
const getUserChoice = async (gameId: string, userId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game_choice/${gameId}`, "POST", {
    data: {
      userId: userId,
    },
  });

  return Object.keys(data).length === 0 ? null : data;
};
const countGameView = async (gameId: string, userId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game_view_count/${gameId}`, "POST", {
    data: {
      userId: userId,
    },
  });

  return data;
};

export default async function GamePage(props: { gameId: string }) {
  const params = await props.params;
  const session = await auth();
  const userId: string = await AuthUtils.getUserOrGuestIdBySSR(session);

  const { gameId } = params;

  const gameData = await getGame(gameId, userId);
  const userChoiceData = await getUserChoice(gameId, userId);

  return <VersusGameEmbedView gameData={gameData} userChoiceData={userChoiceData} />;
}
