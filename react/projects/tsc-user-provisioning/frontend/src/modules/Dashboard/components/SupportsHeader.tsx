import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SupportsHeader = () => {
  const navigate = useNavigate();

  const onClick = () => navigate('/supports/create');

  return (
    <Box sx={{ width: '100%', textAlign: 'right', mb: 2 }}>
      <Button sx={{ fontSize: '1rem' }} startIcon={<Add sx={{ mb: 0.2 }} />}  variant="contained" onClick={onClick}>
        Add Support
      </Button>
    </Box>
  );
};

export default SupportsHeader;
