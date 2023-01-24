import * as R from 'ramda';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { authAtom } from 'atoms';
import { Select, SelectChips } from 'components';
import { UserRole } from 'enums';
import { omitEmpty, getOptions } from 'utils';
import { LEARNER_ROLE_DISPLAY_MAP } from 'maps';
import { IUsersFilter, ISearchFilter } from '../interfaces';
import FiltersContainer from './FiltersContainer';
import SearchInput from './SearchInput';

interface IUsersFilterProps {
  onChange: (filter: Partial<IUsersFilter>) => any;
}

const initialState: IUsersFilter = {
  role: '' as UserRole,
  cafe_number: [],
  firstname: '',
  lastname: '',
  email: '',
};

const UsersFilter: React.FC<IUsersFilterProps> = ({ onChange }) => {
  const { user } = useRecoilValue(authAtom);
  const [filter, setFilter] = useState(initialState);
  const roleOptions = useMemo(
    () => getOptions(Object.keys(UserRole), LEARNER_ROLE_DISPLAY_MAP),
    [],
  );
  const cafeNumberOptions = useMemo(() => getOptions(user.cafeNumbers), [user]);

  const onRoleChange = useCallback((role: UserRole) => {
    setFilter(R.assoc('role', role));
  }, []);

  const onCafeNumberChange = useCallback((cafe_number: string[]) => {
    setFilter(R.assoc('cafe_number', cafe_number));
  }, []);

  const onSearchChange = useCallback((searchFilter: Partial<ISearchFilter>) => {
    setFilter(R.mergeLeft(searchFilter));
  }, []);

  useEffect(() => {
    onChange(omitEmpty(filter));
  }, [filter, onChange]);

  return (
    <FiltersContainer>
      <Select
        id="user-role"
        label="Learner Role"
        options={roleOptions}
        value={filter?.role}
        onChange={onRoleChange}
      />
      <SelectChips
        id="user-cafe-number"
        label="Café Number"
        options={cafeNumberOptions}
        value={filter?.cafe_number}
        onChange={onCafeNumberChange}
      />
      <SearchInput onChange={onSearchChange} />
    </FiltersContainer>
  );
};

export default UsersFilter;
