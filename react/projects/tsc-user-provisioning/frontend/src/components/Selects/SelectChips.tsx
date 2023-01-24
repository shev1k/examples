import { Box, Chip, MenuItem, OutlinedInput } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import * as R from 'ramda';
import { useCallback, memo } from 'react';

import Select, { ISelectProps } from './Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const getStyles = (value: string, selectedValues: string[]) => ({
  fontWeight: selectedValues.indexOf(value) === -1 ? 'normal' : 'bold',
});

export interface ISelectChipsProps extends Omit<ISelectProps, 'value' | 'onChange'> {
  value: string[];
  onChange: (values: string[]) => void;
}

const SelectChips: React.FC<ISelectChipsProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  formControlProps = {},
  selectProps = {},
}) => {
  const onChipDelete = useCallback(
    (chip: string) => () => {
      onChange(value.filter((selectedValue) => selectedValue !== chip));
    },
    [onChange, value],
  );

  const renderValue = useCallback(
    (values: string[]) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            deleteIcon={<Cancel onMouseDown={(e) => e.stopPropagation()} />}
            onDelete={onChipDelete(value)}
          />
        ))}
      </Box>
    ),
    [onChipDelete],
  );

  const renderOptions = useCallback(
    () =>
      options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          style={getStyles(option.value, value)}
        >
          {option.label}
        </MenuItem>
      )),
    [options, value],
  );

  return (
    <Select
      id={id}
      label={label}
      value={value}
      formControlProps={formControlProps}
      selectProps={R.mergeLeft(
        {
          multiple: true,
          renderValue,
          MenuProps,
          input: id && label ? <OutlinedInput id={id} label={label} /> : undefined,
        },
        selectProps,
      )}
      onChange={onChange}
    >
      {renderOptions()}
    </Select>
  );
};

export default memo(SelectChips);
