import { Box, Button } from '@mui/material';

interface IFormFooter {
  submitLabel: string;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const FormFooter: React.FC<IFormFooter> = ({ submitLabel, onCancel, onSubmit }) => (
  <Box
    sx={{
      width: '100%',
      mt: 2,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 2,
      '& > button': {
        fontSize: '0.9rem'
      }
    }}
  >
    <Button  variant="contained" color="secondary" onClick={onCancel}>Cancel</Button>
    <Button  variant="contained" color="primary" type="submit" onSubmit={onSubmit}>
      {submitLabel}
    </Button>
  </Box>
);

export default FormFooter;
