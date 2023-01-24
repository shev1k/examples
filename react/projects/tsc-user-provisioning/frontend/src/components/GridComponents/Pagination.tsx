import { TablePagination as MuiPagination } from '@mui/material';
import {
  gridPaginationSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';

const Pagination = () => {
  const apiRef = useGridApiContext();
  const { page, pageSize, pageCount } = useGridSelector(
    apiRef,
    gridPaginationSelector,
  );

  return (
    <MuiPagination
      color="primary"
      count={pageCount}
      page={page + 1}
      rowsPerPage={pageSize}
      onPageChange={(_event, value) => apiRef.current.setPage(value - 1)}
      onRowsPerPageChange={(event) =>
        apiRef.current.setPageSize(Number(event.target.value))
      }
    />
  );
};

export default Pagination;
