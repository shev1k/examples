import { TextField, BaseTextFieldProps } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';

interface IFormTextFieldProps
  extends Omit<BaseTextFieldProps, 'name' | 'defaultValue' | 'variant'>,
    UseControllerProps<any> {
  variant?: BaseTextFieldProps['variant'];
}

const FormTextField: React.FC<IFormTextFieldProps> = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  variant = 'standard',
  ...rest
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  return (
    <TextField
      {...field}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      variant={variant}
      {...rest}
    />
  );
};

export default FormTextField;
