"use client";
import { useUi } from "@/hooks/useUi";
import * as VS from "@/styles/VersusStyles";
import VersusMainSearch from "./VersusMainSearch";

const VersusMainTitle = () => {
  const { isScrollTop } = useUi();

  return (
    <VS.MainTitleLayout $is_active={isScrollTop}>
      <VersusMainSearch />
    </VS.MainTitleLayout>
  );
};

export default VersusMainTitle;
