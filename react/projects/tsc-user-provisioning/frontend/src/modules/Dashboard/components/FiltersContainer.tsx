import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

const FiltersContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <Box sx={{ display: 'flex', mb: 1.2, '&& > *:not(:last-child)': { mr: 1.5 } }}>
    {children}
  </Box>
);

export default FiltersContainer;
