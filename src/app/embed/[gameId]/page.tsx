import { auth } from '@/auth';
import VersusGameEmbedView from '@/components/versus/VersusGameEmbedView';
import ApiUtils from '@/utils/ApiUtils';
import AuthServerUtils from '@/utils/AuthUtils.server';
import type { ObjectId } from 'mongodb';

const getGame = async (gameId: string, userId: string) => {
  const params: Record<string, string> = {};

  if (userId) {
    params.userId = userId;
  }

  const { data } = await ApiUtils.request(`/api/versus/game/${gameId}`, 'GET', { params });

  return data;
};
const getUserChoice = async (gameId: string, userId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game_choice/${gameId}`, 'POST', {
    data: {
      userId: userId,
    },
  });

  return Object.keys(data).length === 0 ? null : data;
};
const countGameView = async (gameId: string, userId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game_view_count/${gameId}`, 'POST', {
    data: {
      userId: userId,
    },
  });

  return data;
};

export default async function GamePage(props: { params: { gameId: string } }) {
  const { gameId } = await props.params;
  const session = await auth();
  const userId: string | ObjectId = await AuthServerUtils.getUserOrGuestIdBySSR(session);

  const gameData = await getGame(gameId, userId.toString());
  const userChoiceData = await getUserChoice(gameId, userId.toString());

  return <VersusGameEmbedView gameData={gameData} userChoiceData={userChoiceData} />;
}
