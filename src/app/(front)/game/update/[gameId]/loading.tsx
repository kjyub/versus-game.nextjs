import * as VS from "@/styles/VersusStyles";

export default function Loading() {
  return (
    <VS.EditorLayout>
      <VS.EditorDataLayout className="animate-pulse">
        <VS.EditInfoBox>
          <span className="title">기본 정보</span>
        </VS.EditInfoBox>
        <VS.EditChoiceBox>
          <span className="title w-96">선택지</span>
        </VS.EditChoiceBox>
      </VS.EditorDataLayout>
    </VS.EditorLayout>
  );
}
