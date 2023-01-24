import { Container as MuiContainer, Paper } from '@mui/material';
import { PropsWithChildren } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface IContainerProps extends PropsWithChildren {
  onSubmit: ReturnType<UseFormReturn['handleSubmit']>;
}

const Container: React.FC<IContainerProps> = ({ children, onSubmit }) => (
  <MuiContainer component="form" maxWidth="sm" sx={{ mb: 4 }} onSubmit={onSubmit}>
    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      {children}
    </Paper>
  </MuiContainer>
);

export default Container;
