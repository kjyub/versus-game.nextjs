import VersusEditor from '@/components/versus/VersusEditor';
import ApiUtils from '@/utils/ApiUtils';

const getGame = async (gameId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game/${gameId}`, 'GET');

  return data;
};

export default async function GameUpdatePage(props: { params: Promise<{ gameId: string }> }) {
  const params = await props.params;
  const { gameId } = await params;

  const gameData = await getGame(gameId);

  return <VersusEditor isUpdate={true} gameData={gameData} />;
}
