'use client';
import * as VS from '@/styles/VersusStyles';
import { useEffect, useState } from 'react';

interface IVersusCommentPagination {
  pageIndex: number;
  pageSize: number;
  maxPage: number;
  maxPageButtons: number;
  itemCount: number;
  setPageIndex: (_page: number) => void;
}
export default function VersusCommentPagination({
  pageIndex,
  pageSize,
  maxPage,
  maxPageButtons = 5,
  itemCount,
  setPageIndex,
}: IVersusCommentPagination) {
  const [pages, setPages] = useState<Array<number>>([]);

  useEffect(() => {
    const _pages = [];

    if (maxPage === 0) {
      return;
    }

    const first = (Math.ceil(pageIndex / maxPageButtons) - 1) * maxPageButtons + 1;
    for (let i = first; i < first + maxPageButtons; i++) {
      _pages.push(i);

      if (i === maxPage) {
        break;
      }
    }

    setPages(_pages);
  }, [pageIndex, itemCount, pageSize]);

  const handlePrev = () => {
    setPageIndex((Math.floor(pageIndex / maxPageButtons) - 1) * maxPageButtons + 1);
  };

  const handleNext = () => {
    setPageIndex((Math.floor((pageIndex - 1) / maxPageButtons) + 1) * maxPageButtons + 1);
  };

  return (
    <VS.CommentPaginationBox>
      {pageIndex > maxPageButtons && (
        <VS.CommentPaginationButton
          $is_active={false}
          onClick={() => {
            handlePrev();
          }}
        >
          <i className="fa-solid fa-backward"></i>
        </VS.CommentPaginationButton>
      )}
      {pages.map((page: number, index: number) => (
        <VS.CommentPaginationButton
          key={index}
          $is_active={page === pageIndex}
          onClick={() => {
            setPageIndex(page);
          }}
        >
          {page}
        </VS.CommentPaginationButton>
      ))}
      {pageIndex <= Math.floor(maxPage / maxPageButtons) * maxPageButtons && maxPage > maxPageButtons && (
        <VS.CommentPaginationButton
          $is_active={false}
          onClick={() => {
            handleNext();
          }}
        >
          <i className="fa-solid fa-forward"></i>
        </VS.CommentPaginationButton>
      )}
    </VS.CommentPaginationBox>
  );
}
