import { IFormatter } from '../Interfaces/utilInterfaces';

const formatter: IFormatter = {
  formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  formatDate(date) {
    return date.toISOString().split('T')[0];
  },

  formatTime(date) {
    return date.toISOString().split('T')[1].split('.')[0];
  },

  formatZero(number) {
    if (number.length === 1) return `0${number}`;
    return number;
  },
};

export default formatter;
