const getOptions = <T extends string>(
  values: T[],
  labelMap?: Record<T, string>,
) =>
  values.map((value) => ({
    value,
    label: labelMap ? labelMap[value] : value,
  }));

export default getOptions;
