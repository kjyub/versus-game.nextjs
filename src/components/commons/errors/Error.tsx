import Link from 'next/link';

interface Props {
  code?: string;
  message?: string;
  redirectUrl?: string;
}
export default function ErrorComponent({ code, message, redirectUrl }: Props) {
  return (
    <div className="fixed inset-0 flex flex-center w-full h-dvh max-sm:px-8 pointer-events-none">
      <div className="flex flex-col flex-center max-sm:px-8 sm:px-32 max-sm:py-10 sm:py-18 gap-8 max-sm:rounded-2xl sm:rounded-4xl layer-bg-2 pointer-events-auto">
        <div className="flex flex-col items-center gap-2">
          {code && <h1 className="text-4xl sm:text-6xl font-bold text-white text-center">{code}</h1>}
          {message && <h2 className="text-lg sm:text-xl text-white text-center">{message}</h2>}
        </div>
        {redirectUrl && (
          <Link href={redirectUrl}>
            <button
              className="px-8 py-4 max-sm:text-base sm:text-xl font-medium text-white rounded-xl layer-bg layer-hover transition-colors"
              type="button"
            >
              홈으로 돌아가기
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
