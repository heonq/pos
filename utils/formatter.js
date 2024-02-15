const formatter = {
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
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },

  formatTime(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  },
};

export default formatter;
