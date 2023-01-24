import * as R from 'ramda';
import { useController, UseControllerProps } from 'react-hook-form';

import Select, { ISelectProps } from './Select';

export interface IFormSelectProps
  extends Omit<ISelectProps, 'value' | 'onChange'>,
    UseControllerProps<any> {}

const FormSelect: React.FC<IFormSelectProps> = ({
  name,
  control,
  rules,
  defaultValue = '',
  formControlProps = {},
  selectProps = {},
  ...rest
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const { ref } = field;

  return (
    <Select
      {...R.omit(['ref'], field)}
      selectProps={{
        ...selectProps,
        inputRef: ref,
      }}
      formControlProps={{
        ...formControlProps,
        error: fieldState.error,
      }}
      {...rest}
    />
  );
};

export default FormSelect;
