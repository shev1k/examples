import * as R from 'ramda';

const omitEmpty = R.pickBy((value) => {
  const formatted = typeof value === 'string' ? value.trim() : value;
  const isEmpty = !R.isNil(formatted) && !R.isEmpty(formatted);
  return isEmpty;
});

export default omitEmpty;
