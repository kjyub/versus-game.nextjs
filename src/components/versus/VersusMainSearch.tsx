'use client'

import * as VS from '@/styles/VersusStyles'
import { CookieConsts } from '@/types/ApiTypes'
import CommonUtils from '@/utils/CommonUtils'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import VersusSearchInput from './inputs/VersusSearchInput'

interface IVersusMainSearch {}
const VersusMainSearch = ({}: IVersusMainSearch) => {
  const session = useSession()

  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState<string>('')
  const [isMyGame, setMyGame] = useState<boolean>(false)
  const [isChoiceGame, setChoiceGame] = useState<boolean>(false)

  useEffect(() => {
    const search = searchParams.get('search')

    if (!CommonUtils.isStringNullOrEmpty(search)) {
      setSearchValue(search)
    }

    const myGames = searchParams.get('myGames')
    setMyGame(myGames !== null)

    const choiced = searchParams.get('choiced')
    setChoiceGame(choiced !== null)
  }, [searchParams])

  const handleSearch = () => {
    let query = {}

    // 게임 리스트 페이지로 되돌아 올 시 저장하는 데이터 삭제
    sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION)

    // 현재 쿼리를 query에 추가
    searchParams.forEach((value: string, key: string, parent: URLSearchParams) => {
      query[key] = value
    })

    // 검색어가 없으면 query에서 search 제거
    if (!CommonUtils.isStringNullOrEmpty(searchValue)) {
      query['search'] = searchValue
    } else {
      delete query.search
    }

    let queryUrl = ''
    if (Object.keys(query).length > 0) {
      queryUrl += '?'
      queryUrl += new URLSearchParams(query).toString()
    }

    router.push(`/${queryUrl}`)
  }

  const handleMyGame = () => {
    let query = {}

    // 현재 쿼리를 query에 추가
    searchParams.forEach((value: string, key: string, parent: URLSearchParams) => {
      query[key] = value
    })

    // 내 게임을 활성화
    if (!isMyGame) {
      query['myGames'] = 1
    } else {
      delete query.myGames
    }

    let queryUrl = ''
    if (Object.keys(query).length > 0) {
      queryUrl += '?'
      queryUrl += new URLSearchParams(query).toString()
    }

    router.push(`/${queryUrl}`)
  }
  const handleChoiceGame = () => {
    let query = {}

    // 현재 쿼리를 query에 추가
    searchParams.forEach((value: string, key: string, parent: URLSearchParams) => {
      query[key] = value
    })

    // 내 게임을 활성화
    if (!isChoiceGame) {
      query['choiced'] = 1
    } else {
      delete query.choiced
    }

    let queryUrl = ''
    if (Object.keys(query).length > 0) {
      queryUrl += '?'
      queryUrl += new URLSearchParams(query).toString()
    }

    router.push(`/${queryUrl}`)
  }

  return (
    <VS.MainSearchLayout>
      <VS.MainSearchFilterMenuBox>
        {/* 정렬 (사용 안할 수도 있음) */}
        <div className="section"></div>
        <div className="section">
          {session.status === 'authenticated' && (
            <VS.MainSearchFilterMenuButton
              $is_active={isChoiceGame}
              onClick={() => {
                handleChoiceGame()
              }}
            >
              참여한 게임
            </VS.MainSearchFilterMenuButton>
          )}
          {session.status === 'authenticated' && (
            <VS.MainSearchFilterMenuButton
              $is_active={isMyGame}
              onClick={() => {
                handleMyGame()
              }}
            >
              내 게임
            </VS.MainSearchFilterMenuButton>
          )}
        </div>
      </VS.MainSearchFilterMenuBox>
      <VersusSearchInput
        value={searchValue}
        setValue={setSearchValue}
        onEnter={() => {
          handleSearch()
        }}
      />
    </VS.MainSearchLayout>
  )
}

export default VersusMainSearch
