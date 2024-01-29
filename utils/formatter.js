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
};

export default formatter;
