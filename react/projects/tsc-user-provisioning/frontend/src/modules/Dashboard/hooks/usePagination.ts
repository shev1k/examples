import { useState, useCallback } from 'react';

import { DEFAULT_PAGE_SIZE } from '../constants';
import { IPagination, IPaginationActions } from '../interfaces';

const usePagination = (): IPagination & IPaginationActions => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const onPageChange = useCallback((page: number) => setPage(page), []);

  const onPageSizeChange = useCallback(
    (nextPageSize: number) => setPageSize(nextPageSize),
    [],
  );

  return {
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
  };
};

export default usePagination;
