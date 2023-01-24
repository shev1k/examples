import { DataGrid as MuiDataGrid, DataGridProps } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const DataGrid = (props: DataGridProps) => (
  <Box sx={{ pointerEvents: props.loading ? 'none' : 'initial', height: '100%' }}>
    <MuiDataGrid {...props} />
  </Box>
);

export default DataGrid;
