import { FormControl, OutlinedInput, InputLabel } from '@mui/material';
import { useState, useCallback, memo } from 'react';

import { useDebounceFn } from 'hooks';
import { ISearchFilter } from '../interfaces';

interface ISearchInputProps {
  onChange: ({ firstname, lastname, email }: Partial<ISearchFilter>) => any;
}

const SearchInput: React.FC<ISearchInputProps> = ({ onChange }) => {
  const [value, setValue] = useState('');
  const debouncedChange = useDebounceFn(onChange);

  const onInputChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const [firstname, lastname, email] = target.value.split(/,\s?/);
      setValue(target.value);
      debouncedChange({ firstname, lastname, email });
    },
    [debouncedChange],
  );

  return (
    <FormControl fullWidth>
      <InputLabel>Search</InputLabel>
      <OutlinedInput
        autoComplete="off"
        id="search-input"
        label="Search"
        placeholder="First Name, Last Name, Email"
        value={value}
        onChange={onInputChange}
      />
    </FormControl>
  );
};

export default memo(SearchInput);
