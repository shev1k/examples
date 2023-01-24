import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from 'components';

const PasswordUpdateSuccess = () => {
  const navigate = useNavigate();

  const onBack = () => navigate('/login');

  return (
    <Container>
      <Typography variant="h4">Password updated successfully!</Typography>
      <Button onClick={onBack}>Go back to login page</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0 10px 0;

  > button {
    margin-top: 15px;
  }
`;

export default PasswordUpdateSuccess;
