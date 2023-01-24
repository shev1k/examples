import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { Sidebar } from 'components';

const Layout = () => (
  <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        mx: 2,
        my: 1,
        p: 5,
        width: 'calc(100% - 32px)',
        height: 'calc(100% - 16px)',
      }}
    >
      <Outlet />
    </Box>
  </Box>
);

export default Layout;
