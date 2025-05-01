"use client";
import * as VS from "@/styles/VersusStyles";
import VersusMainSearch from "./VersusMainSearch";
import { useState } from "react";
import { useDetectClose } from "@/hooks/useDetectClose";

const VersusMainTitle = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [menuRef, isMenuShow, setIsMenuShow] = useDetectClose();

  const openMenu = () => {
    setIsMenuShow(true);
  };

  const closeMenu = () => {
    setIsMenuShow(false);
  };

  return (
    <VS.MainTitleLayout ref={menuRef}>
      <VersusMainSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isMenuShow={isMenuShow}
        openMenu={openMenu}
      />
      <div className={`title-search-menu ${isMenuShow ? "show" : ""}`}></div>
    </VS.MainTitleLayout>
  );
};

export default VersusMainTitle;
