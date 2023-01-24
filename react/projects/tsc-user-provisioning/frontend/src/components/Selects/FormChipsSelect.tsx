import * as R from 'ramda';
import { useController, UseControllerProps } from 'react-hook-form';

import SelectChips, { ISelectChipsProps } from './SelectChips';

export interface IFormChipsSelectProps
  extends Omit<ISelectChipsProps, 'value' | 'onChange'>,
    UseControllerProps<any> {}

// TODO: this component is almost fully copy pasted from FormSelect.tsx which is not great I think
const FormChipsSelect: React.FC<IFormChipsSelectProps> = ({
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
    <SelectChips
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

export default FormChipsSelect;
