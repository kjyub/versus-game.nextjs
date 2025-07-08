'use client';

import Link from "next/link";

export default function VersusListBlank({ search }: { search: string }) {
  return (
    <div className="flex flex-col flex-center px-8 py-6 gap-4 rounded-xl layer-bg">
      <div className="text-2xl font-semibold text-stone-200">
        {search ? `"${search}"` : ''} 검색 결과가 없습니다.
      </div>

      <Link href={`/game/add?title=${search}`} className="px-4 py-2 rounded-xl bg-indigo-600/70 text-lg font-semibold text-stone-200">
        게임 만들기
      </Link>
    </div>
  );
}