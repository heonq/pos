import { Product, Category } from './DataInterfaces';

export interface Formatter {
  formatNumber(number: number): string;
  formatDataSetToText(dataSet: string): string;
  formatTextToDataSet(text: string): string;
  formatDate(date: Date): string;
  formatTime(date: Date): string;
  formatZero(number: string): string;
}

export interface Validator {
  validateDiscount(type: string, discountValue: number, totalAmount: number): boolean;
  validatePercentage(discountValue: number): boolean;
  validateAmount(discountValue: number, totalAmount: number): boolean;
  validateTotalAmount(totalAmount: number): boolean;
  validateSplitPayment(amounts: number[], totalAmount: number): boolean;
  validatePaymentMethod(paymentInfo: string): boolean;
  validateProductsNames(products: Product[]): boolean;
  validateBarcodes(products: Product[]): boolean;
  validatePrice(products: Product[]): boolean;
  validateInteger(number: number): boolean;
  validateProductRegistration(products: Product[]): boolean;
  validateSalesQuantity(salesQuantity: number): boolean;
  validateSelectedRows(rowsLength: number): boolean;
  validateCategories(categories: Category[]): boolean;
  validateDuplicatedNames(names: string[]): boolean;
  validateBlankNames(names: string[]): boolean;
  validateLastStringBlank(names: string[]): boolean;
  validateCategoryDelete(categoryNumber: number, products: Product[]): boolean;
  validateCashCheckInputs(values: number[]): boolean;
  validateRefund(refundHistory: string): boolean;
}
