import {
  List,
  ListItemButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from 'atoms';
import { routes } from 'configs/routes/constants';

const SidebarItems = () => {
  const { user } = useRecoilValue(authAtom);

  const renderItems = () =>
    routes
      .filter((route) => route.roles.includes(user.accountType) && !route.hidden)
      .map(({ label, path, Icon }, index) => (
        <ListItem key={index} disablePadding>
          <NavLink
            to={path}
            end={path === '/'}
            style={{ textDecoration: 'none', width: '100%' }}
          >
            {({ isActive }) => (
              <>
                <ListItemButton
                  sx={{
                    alignItems: 'center',
                    p: 1.5,
                    background: isActive ? grey[100] : 'initial',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '35px' }}>
                    <Icon
                      sx={{
                        color: isActive ? '#000' : grey[600],
                        fontSize: '1.8rem',
                        ml: 0.5,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      '& span': {
                        color: isActive ? '#000' : grey[600],
                        opacity: isActive ? 1 : 0.7,
                        fontSize: '1rem',
                        fontWeight: isActive ? 'bold' : 'normal',
                        ml: 2.5,
                      },
                    }}
                    primary={label}
                  />
                </ListItemButton>
              </>
            )}
          </NavLink>
        </ListItem>
      ));

  return <List disablePadding>{renderItems()}</List>;
};

export default SidebarItems;
