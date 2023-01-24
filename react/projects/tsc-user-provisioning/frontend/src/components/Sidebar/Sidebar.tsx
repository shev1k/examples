import { Drawer, Divider } from '@mui/material';

import SidebarUser from './SidebarUser';
import SidebarItems from './SidebarItems';

const drawerWidth = 270;

const Sidebar = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
    }}
  >
    <SidebarUser />
    <Divider />
    <SidebarItems />
  </Drawer>
);

export default Sidebar;
