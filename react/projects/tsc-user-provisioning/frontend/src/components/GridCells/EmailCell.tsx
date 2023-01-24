import { blue } from '@mui/material/colors';

interface IEmailCellProps {
  email: string;
}

const EmailCell: React.FC<IEmailCellProps> = ({ email }) => (
  <a style={{ color: blue[800] }} href={`mailto:${email}`}>
    {email}
  </a>
);

export default EmailCell;
