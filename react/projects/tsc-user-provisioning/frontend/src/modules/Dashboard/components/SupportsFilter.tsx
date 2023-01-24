import * as R from 'ramda';
import { useState, useCallback, useEffect } from 'react';

import { Select } from 'components';
import { SupportRole } from 'enums';
import { omitEmpty } from 'utils';
import { ISupportsFilter, ISearchFilter } from '../interfaces';
import SearchInput from './SearchInput';
import FiltersContainer from './FiltersContainer';

interface ISupportsFilterProps {
  onChange: (filter: Partial<ISupportsFilter>) => any;
}

const initialState: ISupportsFilter = {
  role: '' as SupportRole,
  firstname: '',
  lastname: '',
  email: '',
};

const SupportsFilter: React.FC<ISupportsFilterProps> = ({ onChange }) => {
  const [filter, setFilter] = useState(initialState);

  const onRoleChange = useCallback((role: SupportRole) => {
    setFilter(R.assoc('role', role));
  }, []);

  const onSearchChange = useCallback((searchFilter: Partial<ISearchFilter>) => {
    setFilter(R.mergeLeft(searchFilter));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(omitEmpty(filter));
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [filter, onChange]);

  return (
    <FiltersContainer>
      <Select
        id="support-role"
        label="Learner Role"
        options={[]}
        value={filter?.role}
        onChange={onRoleChange}
      />
      <SearchInput onChange={onSearchChange} />
    </FiltersContainer>
  );
};

export default SupportsFilter;
