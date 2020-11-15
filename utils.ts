export const MS_PER_DAY = 86400000;

export function zeroOutDate(date: Date): Date {
  date = new Date(date);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return new Date(date);
}
