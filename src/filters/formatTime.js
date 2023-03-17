import moment from 'moment';

export default (time, formatter) => {
  if (!time) {
    return '';
  }
  return moment(time).format(formatter);
};
