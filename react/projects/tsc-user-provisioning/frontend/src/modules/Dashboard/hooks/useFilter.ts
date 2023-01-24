import { useState } from 'react';

// TODO: is useless right now, should be removed
const useFilter = <T>() => {
  const [filter, setFilter] = useState<Partial<T>>({});
  return { filter, onFilterChange: setFilter };
};

export default useFilter;
