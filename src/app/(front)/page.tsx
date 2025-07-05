import { auth } from '@/auth';
import VersusList from '@/components/versus/VersusList';
import VersusMainTitle from '@/components/versus/VersusMainTitle';
import * as MainStyles from '@/styles/MainStyles';
import type { IPaginationResponse } from '@/types/common/Responses';
import ApiUtils from '@/utils/ApiUtils';
import { getUserOrGuestIdBySSR } from '@/utils/AuthUtils.server';
import type { ObjectId } from 'mongodb';

const getGameList = async (
  search: string | undefined,
  myGames: boolean,
  choiced: boolean,
  userId: string,
): Promise<IPaginationResponse> => {
  const params: {
    search?: string;
    myGames?: number;
    choiced?: number;
    userId?: string;
  } = {};

  if (search) {
    params.search = search;
  }
  if (myGames) {
    params.myGames = 1;
  }
  if (choiced) {
    params.choiced = 1;
  }
  if (userId) {
    params.userId = userId;
  }

  const { data } = await ApiUtils.request('/api/versus/game', 'GET', { params });

  return data as IPaginationResponse;
};

export default async function Home(props: {
  searchParams: Promise<{ search?: string; myGames?: string; choiced?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const userId: string | ObjectId = await getUserOrGuestIdBySSR(session);

  const search: string = searchParams.search ? searchParams.search : '';
  const myGames: boolean = !!searchParams.myGames;
  const choiced: boolean = !!searchParams.choiced;
  const gamePaginationData: IPaginationResponse = await getGameList(search, myGames, choiced, userId.toString());

  return (
    <MainStyles.PageLayout id="game-list-page">
      <VersusMainTitle />
      <VersusList versusGameData={gamePaginationData} />
    </MainStyles.PageLayout>
  );
}
