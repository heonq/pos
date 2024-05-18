import { IFormatter } from '../Interfaces/utilInterfaces';

const formatter: IFormatter = {
  formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  formatDataSetToText(dataSet) {
    return dataSet.replaceAll('_', ' ');
  },

  formatTextToDataSet(text) {
    return text.replaceAll(' ', '_');
  },

  formatDate(date) {
    const dateInfo = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((info) =>
      this.formatZero(String(info)),
    );
    return dateInfo.join('-');
  },

  formatTime(date) {
    const timeInfo = [date.getHours(), date.getMinutes(), date.getSeconds()].map((info) =>
      this.formatZero(String(info)),
    );
    return timeInfo.join(':');
  },

  formatZero(number) {
    if (number.length === 1) return `0${number}`;
    return number;
  },
};

export default formatter;
