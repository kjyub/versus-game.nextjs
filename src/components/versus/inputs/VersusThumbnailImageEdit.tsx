"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import { useState } from "react"
import tw from "tailwind-styled-components"
import { StyleProps } from "@/types/StyleTypes"
import ImageDragAndDrop from "@/components/commons/inputs/ImageDragAndDrop"

const Layout = tw.div`
    absolute
    flex w-full h-full mt-2
    ${(props: StyleProps) =>
        props.$is_show ? "opacity-100 z-10" : "opacity-0 -z-10"}
`

interface IVersusThumbnailEdit {
    isShow: boolean
}
export default function VersusThumbnailImageEdit({
    isShow,
}: IVersusThumbnailEdit) {
    const [isFileEnter, setFileEnter] = useState<boolean>(false)

    const handleImageUpload = (_file: File) => {
        console.log(_file)
    }

    const handleImageUploadButton = (
        e: ChangeEventHandler<HTMLInputElement>,
    ) => {
        const files = e.target.files

        if (files && files.length > 0) {
            handleImageUpload(files[0])
        }
    }

    return (
        <Layout className="space-x-2" $is_show={isShow}>
            <VS.ThumbnailImageEditPreviewBox>
                이미지가 없습니다
            </VS.ThumbnailImageEditPreviewBox>
            <VS.ThumbnailImageEditUploadBox>
                <ImageDragAndDrop
                    handleUpload={handleImageUpload}
                    setFileEnter={setFileEnter}
                >
                    <VS.ThumbnailImageEditUploadDragBox
                        $is_active={isFileEnter}
                    >
                        여기에 썸네일 이미지를 드래그하세요
                    </VS.ThumbnailImageEditUploadDragBox>
                </ImageDragAndDrop>
                <>
                    <input
                        id="versus-thumbnail-image-upload"
                        className="hidden"
                        type={"file"}
                        onChange={handleImageUploadButton}
                    />
                    <VS.ThumbnailImageEditUploadButton for="versus-thumbnail-image-upload">
                        이미지 업로드
                    </VS.ThumbnailImageEditUploadButton>
                </>
            </VS.ThumbnailImageEditUploadBox>
        </Layout>
    )
}
