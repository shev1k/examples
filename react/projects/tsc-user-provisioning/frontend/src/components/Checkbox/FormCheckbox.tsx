import Checkbox, { ICheckboxProps } from './Checkbox';
import { useController, UseControllerProps } from 'react-hook-form';
import React from 'react';

interface IFormCheckboxProps
  extends Omit<ICheckboxProps, 'name' | 'checked' | 'onChange' | 'defaultValue'>,
    UseControllerProps<any> {}

const FormCheckbox: React.FC<IFormCheckboxProps> = ({
  name,
  rules,
  defaultValue,
  control,
  ...rest
}) => {
  const { field } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(event.target.checked);
  };

  return (
    <Checkbox
      name={field.name}
      inputRef={field.ref}
      checked={field.value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default FormCheckbox;
