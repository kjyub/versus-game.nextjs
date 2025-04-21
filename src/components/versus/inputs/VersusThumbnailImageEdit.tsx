"use client";

import ImageDragAndDrop from "@/components/commons/inputs/ImageDragAndDrop";
import * as VS from "@/styles/VersusStyles";
import { StyleProps } from "@/types/StyleTypes";
import VersusFile from "@/types/file/VersusFile";
import ApiUtils from "@/utils/ApiUtils";
import Image from "next/image";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";

const Layout = tw.div`
    flex flex-col w-full gap-2
`;

interface IVersusThumbnailEdit {
  isShow: boolean;
  oldImageId?: string;
  updateThumbnail: (file: VersusFile) => void;
}
export default function VersusThumbnailImageEdit({ isShow, oldImageId, updateThumbnail }: IVersusThumbnailEdit) {
  const [isFileEnter, setFileEnter] = useState<boolean>(false);
  const [image, setImage] = useState<VersusFile>(new VersusFile());

  useEffect(() => {
    getOldThumbnail();
  }, [oldImageId]);

  const getOldThumbnail = async () => {
    if (!oldImageId) {
      return;
    }

    const [bResult, statusCode, response] = await ApiUtils.request(`/api/files/${oldImageId}`, "GET");

    if (!bResult) {
      alert("썸네일 파일을 찾을 수 없습니다.");
      return;
    }

    const _file = new VersusFile();
    _file.parseResponse(response);

    setImage(_file);
  };

  const handleImageUpload = async (_file: File) => {
    // 이미지 축소시킬 것
    const [bResult, statusCode, response] = await ApiUtils.fileUpload(_file);

    if (!bResult) {
      alert("업로드 실패했습니다.");
      return;
    }

    const versusFile = new VersusFile();
    versusFile.parseResponse(response);
    setImage(versusFile);
    updateThumbnail(versusFile);
  };

  const handleImageUploadButton = (e: ChangeEventHandler<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  return (
    <Layout $is_show={isShow}>
      <VS.ThumbnailImageEditPreviewBox>
        <VS.ThumbnailImageEditPreviewImageBox>
          {!image.isEmpty() ? <Image src={image.mediaUrl()} fill alt="" /> : "이미지가 없습니다"}
        </VS.ThumbnailImageEditPreviewImageBox>
      </VS.ThumbnailImageEditPreviewBox>
      <VS.ThumbnailImageEditUploadBox>
        <ImageDragAndDrop handleUpload={handleImageUpload} setFileEnter={setFileEnter} styleClass={"max-sm:hidden"}>
          <VS.ThumbnailImageEditUploadDragBox $is_active={isFileEnter}>
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
  );
}
