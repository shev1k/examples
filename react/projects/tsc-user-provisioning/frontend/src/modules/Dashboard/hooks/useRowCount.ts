import { useState, useEffect } from 'react';

import { IUseRowCount } from '../interfaces';

const useRowCount = ({ totalItems }: IUseRowCount) => {
  const [rowCount, setRowCount] = useState(totalItems || 0);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  useEffect(() => {
    setRowCount((prevRowCount) =>
      totalItems !== undefined ? totalItems : prevRowCount,
    );
  }, [totalItems, setRowCount]);

  return { rowCount };
};

export default useRowCount;
