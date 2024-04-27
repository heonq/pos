import {
  Products,
  Product,
  Categories,
  Category,
  ShoppingCartProduct,
  PaymentInfo,
  SplitPayment,
  CashCheck,
  Statistic,
} from './DataInterfaces';
import { DiscountType, PaymentMethod, SalesHistory } from '../Types/Types';

export interface ProductDataInterface {
  getProducts(): Products;
  getCategories(): Categories;
  getProductsInOrder(): Product[][];
  getCategoriesGotProduct(): Category[];
  convertCategoryNumberToName(categoryNumber: number): string;
  convertCategoryNameToNumber(categoryName: string): number;
  deleteProduct(targetNumber: number): void;
  deleteCategory(targetNumber: number): void;
  registerProduct(): void;
  registerCategory(): void;
  updateProduct(productNumber: number, updateData: Product): void;
  updateCategory(categoryNumber: number, updateData: Category): void;
  getNewestNumber(type: string): number;
  updateNumberHistory(type: string, count: number): void;
}

export interface ShoppingCartDataInterface {
  getShoppingCartData(): ShoppingCartProduct[];
  getTotalAmount(): number;
  addToShoppingCart(product: Product): void;
  plusQuantity(productNumber: number): void;
  minusQuantity(productNumber: number): void;
  deleteFromCart(productNumber: number): void;
  initShoppingCart(): void;
}

export interface SalesDataInterface {
  initSalesHistory(dateText: string): void;
  setSalesInfo(paymentInfo: PaymentInfo): void;
  initSalesInfo({ chargeAmount, method }: { chargeAmount: number; method: PaymentMethod }): void;
  handleETCInfo(paymentInfo: PaymentInfo): void;
  handleDiscountInfo(paymentInfo: PaymentInfo): void;
  setSalesHistoryToStorage(paymentInfo: PaymentInfo, splitPayment: SplitPayment): void;
  refund(date: string, salesNumber: number): void;
  editNote(date: string, salesNumber: number, editedNote: string): void;
  handleSplitPayment(splitPayment: SplitPayment): void;
  getSalesNumber(): number;
  getSalesHistory(dateText: string): SalesHistory;
  getDateWithSales(): string[];
  getStatistic(dateText: string): Statistic;
  getTotalChargeAmount(filteredHistory: SalesHistory): number;
  getFilteredHistory(method: PaymentMethod): SalesHistory;
}

export interface PaymentDataInterface {
  initPaymentInfo(): void;
  getPaymentInfo(): PaymentInfo;
  updatePaymentMethod(method: PaymentMethod): void;
  updateDiscount(discountValue: number, discountReason: string): void;
  updateDiscountType(type: DiscountType): void;
  updateDiscountValue(discountValue: number): void;
  checkDiscountAmount(): boolean;
  checkDiscountType(): boolean;
  saveSplitPayment(paymentMethod: string[], amount: number[]): void;
  setDefaultSplitPayment(): void;
  deactivateSplitPayment(): void;
  initSplitPayment(): void;
  getSplitPayment(): SplitPayment;
  setETCReason(reason: string): void;
}

export interface CashCheckDataInterface {
  initCashCheck(): void;
  setCashCheck(key: string, value: number | boolean): void;
  setCurrency(currencyUnit: number, value: number): void;
  setCashCheckToStorage(): void;
  getCashCheckHistories(): CashCheck[];
  getCountedAmount(): number;
  getCorrectBoolean(): boolean;
}
