import * as VS from '@/styles/VersusStyles';

export default function Loading() {
  return (
    <VS.EditorLayout>
      <VS.EditorDataLayout className="animate-pulse">
        <VS.EditInfoBox className="max-sm:w-full max-lg:h-[348px]">
          <span className="title">기본 정보</span>
        </VS.EditInfoBox>
        <VS.EditChoiceBox className="max-sm:w-full max-lg:h-[520px]">
          <span className="title">선택지</span>
        </VS.EditChoiceBox>
      </VS.EditorDataLayout>
    </VS.EditorLayout>
  );
}
