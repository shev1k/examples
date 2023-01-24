import { Grid, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface IFormSectionProps extends PropsWithChildren {
  title: string;
}

const FormSection: React.FC<IFormSectionProps> = ({ children, title }) => (
  <>
    <Typography variant="h5" fontWeight="bold" mb={2} mt={6}>
      {title}
    </Typography>
    <Grid container spacing={3} marginBottom={5}>
      {children}
    </Grid>
  </>
);

export default FormSection;
