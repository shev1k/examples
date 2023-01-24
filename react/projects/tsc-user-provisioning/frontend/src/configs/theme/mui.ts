import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& > *': {
            fontSize: '1.1rem !important',
          },
        },
      },
      defaultProps: {
        size: 'small',
        sx: {
          minWidth: 205,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
      defaultProps: {
        disableColumnMenu: true,
        disableSelectionOnClick: true,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            fontWeight: 'bold !important',
          },
        },
      },
    },
  },
});

export default theme;
