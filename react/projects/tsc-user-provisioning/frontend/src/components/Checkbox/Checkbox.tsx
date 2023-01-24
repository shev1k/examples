import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material';

export interface ICheckboxProps extends MuiCheckboxProps {
  label?: string;
}

const Checkbox: React.FC<ICheckboxProps> = ({ label, ...rest }) => {
  if (label)
    return <FormControlLabel control={<MuiCheckbox {...rest} />} label={label} />;

  return <MuiCheckbox {...rest} />;
};

export default Checkbox;
