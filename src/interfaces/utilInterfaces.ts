export interface IFormatter {
  formatNumber(number: number): string;
  formatDataSetToText(dataSet: string): string;
  formatTextToDataSet(text: string): string;
  formatDate(date: Date): string;
  formatTime(date: Date): string;
  formatZero(number: string): string;
}
