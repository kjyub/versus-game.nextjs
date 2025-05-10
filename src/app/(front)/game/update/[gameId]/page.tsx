import VersusEditor from "@/components/versus/VersusEditor";
import ApiUtils from "@/utils/ApiUtils";
import dynamic from "next/dynamic";

const getGame = async (gameId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game/${gameId}`, "GET");

  return data;
};

export default async function GameUpdatePage(props: { gameId: string }) {
  const params = await props.params;
  const { gameId } = params;

  const gameData = await getGame(gameId);

  return <VersusEditor isUpdate={true} gameData={gameData} />;
}
