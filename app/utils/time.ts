import dayjs from 'dayjs';

export const timeFormat = (date: dayjs.ConfigType) => {
  const _date = dayjs(date);
  return _date.format('YYYY-MM-DD HH:mm:ss');
};
