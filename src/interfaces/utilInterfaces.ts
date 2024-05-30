import { IPaymentInfo, ISalesHistory, ISplitPayment } from './DataInterfaces';

export interface IFormatter {
  formatNumber(number: number): string;
  formatDataSetToText(dataSet: string): string;
  formatTextToDataSet(text: string): string;
  formatDate(date: Date): string;
  formatTime(date: Date): string;
  formatZero(number: string): string;
}

export interface IFormGenerator {
  generatePaymentInfo(): IPaymentInfo;
  generateSalesHistory(): ISalesHistory;
}

export interface IValidator {
  validateSplitPayment({ price, method }: ISplitPayment, chargedAmount: number): boolean;
  validateProductName(name: string): boolean;
  validateDuplicatedNames(names: string[]): string[];
  validateBlankName(names: string): boolean;
  validateNameTrim(names: string): boolean;
  validateBarcodes(barcodes: string[]): string[];
  validateInteger(number: number): boolean;
}
