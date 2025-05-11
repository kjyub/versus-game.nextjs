import * as MS from "@/styles/MainStyles";
import * as VS from "@/styles/VersusStyles";

export default function Loading() {
  return (
    <MS.PageLayout id="game-list-page">
      <Title />
      <List />
    </MS.PageLayout>
  );
}

const Title = () => {
  return (
    <VS.MainTitleLayout>
      <VS.MainSearchLayout>
        <VS.SearchInputBox>
          <input type="text" placeholder="주제를 찾거나 추가해보세요" />
        </VS.SearchInputBox>
      </VS.MainSearchLayout>
    </VS.MainTitleLayout>
  );
};

const List = () => {
  return (
    <VS.ListLayout>
      <VS.ListGrid className="w-full">
        {Array.from({ length: 10 }).map((_, index: number) => (
          <VS.ListGameLoadingBox key={index} $is_active={true}></VS.ListGameLoadingBox>
        ))}
      </VS.ListGrid>
    </VS.ListLayout>
  );
};
