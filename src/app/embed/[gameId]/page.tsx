import VersusGameEmbedView from '@/components/versus/VersusGameEmbedView';
import ApiUtils from '@/utils/ApiUtils';

const getGame = async (gameId: string) => {
  const params: Record<string, string> = {};

  const { data } = await ApiUtils.request(`/api/versus/game/${gameId}`, 'GET', { params });

  return data;
};

export default async function GamePage(props: { params: { gameId: string } }) {
  const { gameId } = await props.params;

  const gameData = await getGame(gameId);

  return <VersusGameEmbedView gameData={gameData} />;
}
