import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import * as R from 'ramda';
import { useCallback, memo } from 'react';

import { IOption } from 'interfaces';

interface IFormControlProps extends Omit<FormControlProps, 'error'> {
  error?: {
    message?: string;
  };
}

export interface ISelectProps {
  value: string | string[] | undefined;
  id?: string;
  label?: string;
  options?: IOption[];
  children?: React.ReactNode | React.ReactNode[]; // you can use children for custom options rendering
  formControlProps?: IFormControlProps;
  selectProps?: SelectProps;
  onChange: (value: string | string[]) => void;
}

const Select: React.FC<ISelectProps> = ({
  options,
  value,
  id,
  label,
  children,
  formControlProps = {},
  selectProps = {},
  onChange,
}) => {
  const renderOptions = useCallback(
    () =>
      options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )),
    [options],
  );

  const onSelectChange = useCallback(
    ({ target }: SelectChangeEvent) => {
      onChange(target.value);
    },
    [onChange],
  );

  return (
    <FormControl
      error={!!formControlProps.error}
      {...(R.omit(['error'], formControlProps) as Record<string, any>)}
    >
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <MuiSelect
        labelId={id}
        id={id}
        value={value}
        label={label}
        onChange={onSelectChange}
        {...selectProps}
      >
        {children || renderOptions()}
      </MuiSelect>
      {formControlProps.error && (
        <FormHelperText sx={{ mx: 0 }}>{formControlProps.error.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(Select);
