import { UiContext } from "@/stores/contexts/UiProvider";
import { useContext } from "react";

export const useUi = () => {
  const { isScrollTop, isCloudActive } = useContext(UiContext);

  return { isScrollTop, isCloudActive };
};
