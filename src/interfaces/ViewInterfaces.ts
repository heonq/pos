import {
  Product,
  Category,
  ShoppingCartProduct,
  CashCheck,
  PaymentInfo,
  SalesInfo,
} from './DataInterfaces';

export interface ProductComponentsInterface {
  renderEachProduct(product: Product): string;
  renderEachCategoryComponent(category: Category, productsArray: Product[]): string;
  renderTotalCategoryComponent(categories: Category[], productsArrays: Product[][]): string;
  renderTotalModeComponent(productsArrays: Product[][]): string;
  renderAlertMessage(): string;
}

export interface ShoppingCartComponentsInterface {
  renderShoppingCart(shoppingCartData: ShoppingCartProduct[]): string;
  renderEachCartProduct(cartProduct: ShoppingCartProduct): string;
  rerenderQuantityPrice(cartProduct: ShoppingCartProduct, index: number): void;
  removeCartList(index: number): void;
}

export interface CashCheckModalComponentsInterface {
  renderCashCheckModal(cashSalesAmount: number, pettyCashAmount: number): string;
  renderCashCheckHeader(): string;
  renderCashCheckHistoryHeader(): string;
  renderCashCheckHistoryRow(history: CashCheck): string;
}

export interface CategoryModalComponentsInterface {
  renderCategoryManagementModal(): string;
  renderCategoryRow(category: Category): string;
  renderCategoryRegistrationModal(): string;
  renderCategoryInputs(): string;
}

export interface CommonModalComponentsInterface {
  renderSubmitAndCancelButtons(modalType: string): string;
}

export interface DiscountModalComponentsInterface {
  renderDiscountComponent(paymentInfo: PaymentInfo): string;
  renderDiscountAmount(paymentInfo: PaymentInfo): string;
}

export interface ProductModalComponentsInterface {
  renderProductRegistration(): string;
  renderOptions(select: HTMLSelectElement, categories: string[]): void;
  renderProductInputs(): string;
  renderProductManagementContainer(): string;
  renderProductsInputs(product: Product): string;
}

export interface SalesHistoryModalComponentsInterface {
  renderSalesHistoryContainer(): string;
  renderTable(products: Product[]): string;
  renderProductsTh(products: Product[]): string;
  renderSalesTd(productsSold: ShoppingCartProduct[], productsData: Product[]): string;
  renderTr(eachSalesHistory: SalesInfo, productsData: Product[]): string;
  renderTfoot(totalAmount: number, productsQuantityArray: number[]): string;
  replaceEditButtonToSubmit(e: MouseEvent): void;
  replaceSubmitButtonToEdit(e: MouseEvent): void;
  replaceNoteSpanWithInput(span: HTMLSpanElement): void;
  replaceNoteInputWithSpan(input: HTMLInputElement): void;
}

export interface splitPaymentModalComponentsInterface {
  renderSplitPaymentComponent(paymenInfo: PaymentInfo): string;
}

export interface StatisticModalComponents {
  renderStatisticModalComponents(): string;
  renderStatisticRow(): string;
}
