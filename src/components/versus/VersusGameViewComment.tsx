"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
import { useCallback, useEffect, useState } from "react"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import ApiUtils from "@/utils/ApiUtils"
import CommonUtils from "@/utils/CommonUtils"
import VersusGame from "@/types/versus/VersusGame"
import VersusGameComment from "@/types/versus/VersusGameComment"
import { IPaginationResponse } from "@/types/common/Responses"
import VersusCommentPagination from "./VersusCommentPagination"

const PAGE_SIZE = 5

interface IVersusGameViewComment {
    game: VersusGame
    answerChoice: VersusGameChoice
    isShowResult: boolean
}
export default function VersusGameViewComment({ game, answerChoice, isShowResult }: IVersusGameViewComment) {
    const [comments, setComments] = useState<Array<VersusGameComment>>([])
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [itemCount, setItemCount] = useState<number>(0)
    const [maxPage, setMaxPage] = useState<number>(0)

    const [content, setContent] = useState<string>("")
    const [isInputFocus, setInputFocus] = useState<boolean>(false)
    const [isWriteLoading, setWriteLoading] = useState<boolean>(false)

    useEffect(() => {
        getComments(-1)
    }, [isShowResult])

    const getComments = async (_pageIndex: number) => {
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/versus/comment/${game.nanoId}`, 
            "GET",
            { gameNanoId: game.nanoId, pageIndex: _pageIndex, pageSize: PAGE_SIZE }
        )

        if (!bResult) {
            return
        }
        
        const pagination: IPaginationResponse = response

        let _comments: Array<VersusGameComment> = []
        pagination.items.map(item => {
            const newComment = new VersusGameComment()
            newComment.parseResponse(item)
            _comments.push(newComment)
        })
        setComments(_comments)

        setPageIndex(pagination.pageIndex)
        setItemCount(pagination.itemCount)
        setMaxPage(pagination.maxPage)
    }

    const handlePageIndex = async (_pageIndex: number) => {
        await getComments(_pageIndex)
    }

    const handleWriteComment = async () => {
        if (isWriteLoading) {
            return
        }

        setWriteLoading(true)

        let data = {
            parentId: null,
            gameId: game.id,
            gameChoiceId: answerChoice.id,
            content: content
        }

        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/versus/comment`, 
            "POST",
            null,
            data
        )

        if (!bResult) {
            setWriteLoading(false)
            alert(response["message"] ?? "실패했습니다.")
            return
        }

        setContent("")
        getComments(-1)
        setWriteLoading(false)
    }

    const handleWriteCommentEnter = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleWriteComment()
        }
    }

    return (
        <VS.GameViewCommentLayout $is_show={isShowResult}>
            <span className="title">댓글</span>
            <VS.GameViewCommentList>
                {comments.map((comment: VersusGameComment, index: number) => (
                    <CommentBox key={index} comment={comment} />
                ))}
            </VS.GameViewCommentList>
            
            <div className="flex justify-center w-full">
                <VersusCommentPagination 
                    pageIndex={pageIndex}
                    pageSize={PAGE_SIZE}
                    maxPage={maxPage}
                    maxPageButtons={5}
                    itemCount={itemCount}
                    setPageIndex={handlePageIndex}
                />
            </div>

            <VS.GameViewCommentInputBox $is_focus={isInputFocus}>
                <div className="px-2 py-1 font-semibold text-indigo-400">
                    {answerChoice.title}
                </div>
                <input
                    type={"text"}
                    value={content}
                    onChange={(e)=>{setContent(e.target.value)}}
                    onFocus={()=>{setInputFocus(true)}}
                    onBlur={()=>{setInputFocus(false)}}
                    onKeyDown={handleWriteCommentEnter}
                />
                <VS.GameViewCommentInputButton
                    $is_active={!isWriteLoading} 
                    onClick={()=>{handleWriteComment()}}
                >
                    <i className="fa-solid fa-paper-plane text-lg"></i>
                </VS.GameViewCommentInputButton>
            </VS.GameViewCommentInputBox>
        </VS.GameViewCommentLayout>
    )
}

interface ICommentBox {
    comment: VersusGameComment
}
const CommentBox = ({comment}: ICommentBox) => {
    return (
        <VS.GameViewCommentBox>
            <div className="flex items-center w-full">
                {/* 선택지 */}
                <div className="relative flex flex-center px-4 py-1 rounded-lg overflow-hidden">
                    {comment.gameChoiceId}
                    <div className="absolute z-0 w-full h-full bg-gradient-to-tr from-emerald-500 to-yellow-500">

                    </div>
                    <span 
                        className="absolute z-10 text-white"
                        style={{
                            textShadow: "-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c",
                        }}
                    >
                        {comment.gameChoiceId}
                    </span>
                </div>
                {/* 유저 */}
                <span className="ml-2 text-stone-400 text-sm">
                    {comment.userId}
                </span>
                {/* 생성일 */}
                <span className="ml-auto text-stone-400 text-sm">
                    생성일
                </span>
            </div>
            <p className="w-full mt-3 px-1 text-stone-300">
                {comment.content}
            </p>
        </VS.GameViewCommentBox>
    )
}