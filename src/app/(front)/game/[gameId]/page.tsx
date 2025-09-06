import { auth } from '@/auth';
import VersusGameView from '@/components/versus/VersusGameView';
import { SiteConsts } from '@/types/SiteTypes';
import ApiUtils from '@/utils/ApiUtils';
import { getUserOrGuestIdBySSR } from '@/utils/AuthUtils.server';
import type { ObjectId } from 'mongodb';
import type { Metadata, ResolvingMetadata } from 'next';

const getGame = async (gameId: string, userId?: string) => {
  const params: { userId?: string } = {};

  if (userId) {
    params.userId = userId;
  }

  const { data } = await ApiUtils.request(`/api/versus/game/${gameId}`, 'GET', { params, useCache: true }, { revalidate: 300, tags: [`games:view:${gameId}`] });

  return data as any;
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

type Props = {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  // params에서 id 추출
  const { gameId } = params;

  const gameData = await getGame(gameId);
  const titleRaw = gameData.title ?? '';
  const descriptionRaw = gameData.content ?? '';

  const suffix = ` | ${SiteConsts.SITE_TITLE}`;

  const title = titleRaw + suffix;
  let description = '';
  if (!descriptionRaw) {
    description = `${SiteConsts.SITE_TITLE} | ${title}의 의견을 골라주세요.`;
  } else {
    description = `${SiteConsts.SITE_TITLE} | ${title}의 의견을 골라주세요. ${descriptionRaw}`;
  }

  let keywords = [titleRaw];
  if (descriptionRaw) {
    keywords.push(descriptionRaw);
  }
  keywords = [...keywords, ...SiteConsts.SITE_KEYWORDS.split(', ')];

  try {
    keywords = [
      ...keywords,
      ...gameData.choices.filter((choice: any) => choice.title).map((choice: any) => choice.title),
    ];
  } catch {
    //
  }

  // 선택적으로 상위 메타데이터에 액세스하고 확장(대체하지 않음)
  // const previousImages = (await parent).openGraph?.images || []

  const metaData = {
    title: title,
    description: description,
    openGraph: {
      // images: ['/some-specific-page-image.jpg', ...previousImages],
    },
    keywords: keywords,
  };

  return metaData;
}

export default async function GamePage(props: { params: Promise<{ gameId: string }> }) {
  const params = await props.params;
  const session = await auth();
  const userId: string | ObjectId = await getUserOrGuestIdBySSR(session);

  const { gameId } = params;

  const gameData = await getGame(gameId, userId.toString());
  const userChoiceData = await getUserChoice(gameId, userId.toString());
  await countGameView(gameId, userId.toString());

  return <VersusGameView gameData={gameData} userChoiceData={userChoiceData} />;
}
