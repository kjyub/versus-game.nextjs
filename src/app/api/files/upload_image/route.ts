import type { NextApiRequest } from 'next';

export async function POST(req: NextApiRequest) {
  const r = await req.json();
  console.log(r);

  // await DBUtils.connect()

  // const mFile = new MFile({
  //     email: email,
  //     password: hashedPassword,
  //     name: name,
  // })

  // try {
  //     const resultUser = await mFile.save()

  //     return ApiUtils.response(resultUser)
  // } catch (err: any) {
  //     console.log("에러", err)
  //     return ApiUtils.serverError(err)
  // }
  // await DBUtils.insertDocument("VersusGame", "users", data)
  // return NextResponse.json({
  //     name: "John Doe",
  // })
}
