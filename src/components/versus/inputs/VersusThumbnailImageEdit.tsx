"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import tw from "tailwind-styled-components"
import { StyleProps } from "@/types/StyleTypes"
import ImageDragAndDrop from "@/components/commons/inputs/ImageDragAndDrop"
import ApiUtils from "@/utils/ApiUtils"
import VersusFile from "@/types/file/VersusFile"
import CommonUtils from "@/utils/CommonUtils"

const Layout = tw.div`
    absolute
    flex max-sm:flex-col max-lg:flex-row lg:flex-col 2xl:flex-row w-full h-full mt-2
    ${(props: StyleProps) =>
        props.$is_show ? "opacity-100 z-10" : "opacity-0 -z-10"}
`

interface IVersusThumbnailEdit {
    isShow: boolean
    oldImageId: string
    updateThumbnail: (file: VersusFile) => void
}
export default function VersusThumbnailImageEdit({
    isShow,
    oldImageId,
    updateThumbnail,
}: IVersusThumbnailEdit) {
    const [isFileEnter, setFileEnter] = useState<boolean>(false)
    const [image, setImage] = useState<VersusFile>(new VersusFile())

    useEffect(() => {
        getOldThumbnail()
    }, [oldImageId])

    const getOldThumbnail = async () => {
        if (CommonUtils.isStringNullOrEmpty(oldImageId)) {
            return
        }

        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/files/${oldImageId}`,
            "GET",
        )

        if (!bResult) {
            alert("썸네일 파일을 찾을 수 없습니다.")
            return
        }

        const _file = new VersusFile()
        _file.parseResponse(response)

        setImage(_file)
    }

    const handleImageUpload = async (_file: File) => {
        // 이미지 축소시킬 것
        const [bResult, statusCode, response] = await ApiUtils.fileUpload(_file)

        if (!bResult) {
            alert("업로드 실패했습니다.")
            return
        }

        const versusFile = new VersusFile()
        versusFile.parseResponse(response)
        setImage(versusFile)
        updateThumbnail(versusFile)
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
        <Layout
            className="max-sm:space-y-2 max-lg:space-x-2 max-lg:space-y-0 max-2xl:space-y-2 2xl:space-x-2"
            $is_show={isShow}
        >
            <VS.ThumbnailImageEditPreviewBox>
                <VS.ThumbnailImageEditPreviewImageBox>
                    {!image.isEmpty() ? (
                        <Image src={image.mediaUrl()} fill alt="" />
                    ) : (
                        "이미지가 없습니다"
                    )}
                </VS.ThumbnailImageEditPreviewImageBox>
            </VS.ThumbnailImageEditPreviewBox>
            <VS.ThumbnailImageEditUploadBox>
                <ImageDragAndDrop
                    handleUpload={handleImageUpload}
                    setFileEnter={setFileEnter}
                    styleClass={"max-sm:hidden"}
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
                    <VS.ThumbnailImageEditUploadButton htmlFor="versus-thumbnail-image-upload">
                        이미지 파일 업로드
                    </VS.ThumbnailImageEditUploadButton>
                </>
            </VS.ThumbnailImageEditUploadBox>
        </Layout>
    )
}
