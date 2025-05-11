import Link from "next/link";

interface Props {
  code?: string;
  message?: string;
  redirectUrl?: string;
}
export default function Error({ code, message, redirectUrl }: Props) {
  return (
    <div className="flex flex-center w-full h-screen">
      <div className="flex flex-col flex-center px-32 py-18 gap-8 rounded-4xl layer-bg-2">
        <div className="flex flex-col items-center gap-2">
          {code && <h1 className="text-6xl font-bold text-white">{code}</h1>}
          {message && <h2 className="text-xl text-white">{message}</h2>}
        </div>
        {redirectUrl && (
          <Link href={redirectUrl}>
            <button className="px-8 py-4 text-xl font-medium text-white rounded-xl layer-bg layer-hover transition-colors">
              홈으로 돌아가기
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
