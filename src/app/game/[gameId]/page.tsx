import { auth } from "@/auth";
import VersusGameView from "@/components/versus/VersusGameView";
import { SiteConsts } from "@/types/SiteTypes";
import ApiUtils from "@/utils/ApiUtils";
import AuthUtils from "@/utils/AuthUtils";
import CommonUtils from "@/utils/CommonUtils";
import { Metadata, ResolvingMetadata } from "next";

const getGame = async (gameId: string, userId: string) => {
  let params = {};

  if (!CommonUtils.isStringNullOrEmpty(userId)) {
    params["userId"] = userId;
  }

  const { data } = await ApiUtils.request(`/api/versus/game/${gameId}`, "GET", params);

  return data;
};
const getUserChoice = async (gameId: string, userId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game_choice/${gameId}`, "POST", null, {
    userId: userId,
  });

  return Object.keys(data).length === 0 ? null : data;
};
const countGameView = async (gameId: string, userId: string) => {
  const { data } = await ApiUtils.request(`/api/versus/game_view_count/${gameId}`, "POST", null, { userId: userId });

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
  const titleRaw = gameData["title"] ?? "";
  const descriptionRaw = gameData["content"] ?? "";

  const suffix = ` | ${SiteConsts.SITE_TITLE}`;

  const title = titleRaw + suffix;
  let description = "";
  if (CommonUtils.isStringNullOrEmpty(descriptionRaw)) {
    description = `${SiteConsts.SITE_TITLE} | ${title}의 의견을 골라주세요.`;
  } else {
    description = `${SiteConsts.SITE_TITLE} | ${title}의 의견을 골라주세요. ${descriptionRaw}`;
  }

  let keywords = [titleRaw];
  if (!CommonUtils.isStringNullOrEmpty(descriptionRaw)) {
    keywords.push(descriptionRaw);
  }
  keywords = [...keywords, ...SiteConsts.SITE_KEYWORDS.split(", ")];

  try {
    keywords = [
      ...keywords,
      ...gameData.choices
        .filter((choice) => !CommonUtils.isStringNullOrEmpty(choice.title))
        .map((choice) => choice.title),
    ];
  } catch {
    //
  }

  // 선택적으로 상위 메타데이터에 액세스하고 확장(대체하지 않음)
  // const previousImages = (await parent).openGraph?.images || []

  let metaData = {
    title: title,
    description: description,
    openGraph: {
      // images: ['/some-specific-page-image.jpg', ...previousImages],
    },
    keywords: keywords,
  };

  return metaData;
}

export default async function GamePage(props: { gameId: string }) {
  const params = await props.params;
  const session = await auth();
  const userId: string = AuthUtils.getUserOrGuestIdBySSR(session);

  const { gameId } = params;

  const gameData = await getGame(gameId, userId);
  const userChoiceData = await getUserChoice(gameId, userId);
  await countGameView(gameId, userId);

  return (
    <>
      <VersusGameView gameData={gameData} userChoiceData={userChoiceData} />
    </>
  );
}
