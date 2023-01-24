import { Typography } from '@mui/material';

import { main } from 'configs/theme';

const colorMap = {
  success: main.palette.success,
  error: main.palette.error,
};

interface IMessage {
  children: JSX.Element | string;
  variant: 'success' | 'error';
  style?: Record<any, any>;
}

const Message: React.FC<IMessage> = ({ children, variant, ...rest }) => (
  <Typography sx={{ mt: 0.5, fontSize: 12, color: colorMap[variant] }} {...rest}>
    {children}
  </Typography>
);

export default Message;
