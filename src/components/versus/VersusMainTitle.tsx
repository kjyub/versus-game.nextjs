'use client';

import { useDetectClose } from '@/hooks/useDetectClose';
import * as VS from '@/styles/VersusStyles';
import { useState } from 'react';
import VersusMainSearch from './VersusMainSearch';

const VersusMainTitle = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [menuRef, isMenuShow, setIsMenuShow] = useDetectClose();

  const openMenu = () => {
    setIsMenuShow(true);
  };

  return (
    <VS.MainTitleLayout ref={menuRef}>
      <VersusMainSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isMenuShow={isMenuShow}
        openMenu={openMenu}
      />
      <div className={`title-search-menu ${isMenuShow ? 'show' : ''}`}></div>
    </VS.MainTitleLayout>
  );
};

export default VersusMainTitle;
