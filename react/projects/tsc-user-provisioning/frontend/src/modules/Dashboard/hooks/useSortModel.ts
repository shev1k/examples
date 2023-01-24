import { useState } from 'react';

import { DEFAULT_SORT_MODEL } from '../constants';
import { ISortModel } from '../interfaces';

const useSortModel = (initalModel: ISortModel = DEFAULT_SORT_MODEL) => {
  const [sortModel, setSortModel] = useState<ISortModel>(initalModel);

  const onSortModelChange = (nextSortModel: ISortModel | undefined) => {
    if (nextSortModel) {
      setSortModel(nextSortModel);
    } else {
      setSortModel((prev) => ({ ...prev, order: null }));
    }
  };

  return { sortModel, onSortModelChange };
};

export default useSortModel;
