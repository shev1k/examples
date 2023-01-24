type Seconds = number;

export const getUTC = (date: Date, shift: Seconds = 0): Date => {
  const utc = new Date(date.toUTCString());
  return new Date(Number(utc) + shift);
};
