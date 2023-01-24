import { Box, Avatar } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { useRecoilValue } from 'recoil';

import { authAtom } from 'atoms';

const SidebarUser = () => {
  const { user } = useRecoilValue(authAtom);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 3 }}>
      <Avatar sx={{ background: green[600], fontSize: '1.1rem' }}>
        {user.firstname[0].toUpperCase()}
        {user.lastname[0].toUpperCase()}
      </Avatar>
      <Box sx={{ ml: 2, fontSize: '1rem', maxWidth: '100%', overflow: 'hidden' }}>
        <Box
          sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {user.firstname} {user.lastname}
        </Box>
        <Box
          sx={{
            mt: 0.3,
            fontSize: '0.8rem',
            color: grey[500],
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {user.email}
        </Box>
        <Box sx={{ fontSize: '0.7rem', mt: 0.2, color: grey[400] }}>
          {user.accountType}
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarUser;
