import VersusEditor from '@/components/versus/VersusEditor'
import ApiUtils from '@/utils/ApiUtils'
import dynamic from 'next/dynamic'
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(() => import('@/components/versus/VersusMainSearch'), { ssr: false })

const getGame = async (gameId: string) => {
  const [bResult, statusCode, response] = await ApiUtils.request(`/api/versus/game/${gameId}`, 'GET')

  return response
}

export default async function GameUpdatePage(props: { gameId: string }) {
  const params = await props.params;
  const { gameId } = params

  const gameData = await getGame(gameId)

  return <VersusEditor isUpdate={true} gameData={gameData} />
}
