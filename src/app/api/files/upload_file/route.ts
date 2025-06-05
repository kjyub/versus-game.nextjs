import { auth } from '@/auth';
import MFile from '@/models/file/MFile';
import ApiUtils from '@/utils/ApiUtils';
import DBUtils from '@/utils/DBUtils';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { NextRequest } from 'next/server';
import { v4 } from 'uuid';

const s3Client = new S3Client({
  endpoint: 'https://kr.cafe24obs.com',
  forcePathStyle: true,
  region: 'kr1',
  credentials: {
    accessKeyId: process.env.NEXT_PRIVATE_S3_ACCESS_KEY ?? '',
    secretAccessKey: process.env.NEXT_PRIVATE_S3_SECRET_KEY ?? '',
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.formData();
    const file: File = formData.getAll('files')[0] as File;

    const session = await auth();
    // 유저 확인
    if (!session || !session.user) {
      return ApiUtils.notAuth();
    }

    // const userId = session?.user.id;

    // const encodedName = Buffer.from(file.name).toString("base64")
    const fileUUID = v4();
    const ext = file.type.split('/')[1];
    const bucketName = 'versus.files';
    const fileUrl = `images/${fileUUID}/${file.name}.${ext}`;
    // ext 필요한지 확인 필요 TODO

    const uploadParams = {
      Bucket: bucketName,
      Key: fileUrl,
      Body: await file.arrayBuffer(),
      ContentType: file.type,
      ACL: 'public-read',
    };
    await s3Client.send(new PutObjectCommand(uploadParams));

    // db에 파일 저장
    await DBUtils.connect();

    const mFile = new MFile({
      url: `${bucketName}/${fileUrl}`,
      fileName: file.name,
      size: file.size,
      isDeleted: false,
    });
    const mFileData = await mFile.save();

    return ApiUtils.response(mFileData);
  } catch (err: any) {
    console.log(err);
    return ApiUtils.serverError(err);
  }
}
