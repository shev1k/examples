import { Typography } from '@mui/material';

interface IFormHeaderProps {
  title: string;
}

const FormHeader: React.FC<IFormHeaderProps> = ({ title }) => (
  <Typography
    variant="h3"
    fontWeight="bold"
    align="center"
    sx={{ mb: 6, fontSize: 36 }}
  >
    {title}
  </Typography>
);

export default FormHeader;
