import { DISCOUNT_TYPE, PAYMENT_METHODS } from '../constants/enums';

export interface IProduct {
  name: string;
  number: number;
  price: number;
  category: number;
  display: boolean;
  barcode: string;
  salesQuantity: number;
  [key: string]: string | number | boolean;
}

export interface ICategory {
  name: string;
  number: number;
  display: boolean;
  [key: string]: string | number | boolean;
}

export interface IShoppingCartProduct {
  name: string;
  number: number;
  price: number;
  quantity: number;
}

export interface IPaymentInfo {
  method: PAYMENT_METHODS | '';
  discountType: DISCOUNT_TYPE | '';
  totalAmount: number;
  discountAmount: number;
  discountValue: number;
  chargedAmount: number;
  note: string;
}

export interface ISalesHistory {
  number: number;
  products: IShoppingCartProduct[];
  method: PAYMENT_METHODS | '';
  discountType: DISCOUNT_TYPE | '';
  totalAmount: number;
  discount: boolean;
  discountAmount: number;
  discountValue: number;
  chargedAmount: number;
  note: string;
  date: string;
  time: string;
  refund: boolean;
}

export interface ISplitPayment {
  price: [number, number];
  method: [string, string];
}

export interface IDiscountForm {
  note: string;
  discountType: DISCOUNT_TYPE;
  discountValue: number;
}

export interface IProductRegistration {
  [key: string]: IProductForm[];
}

export interface IProductForm {
  name: string;
  price: number;
  barcode: string;
  category: number;
  display: string;
}

export interface IProductManagement {
  [key: string]: IProductMGMTForm[];
}

export interface IProductMGMTForm {
  checked?: boolean;
  number: number;
  name: string;
  price: number;
  barcode: string;
  category: number;
  display: string;
  salesQuantity: number;
  [key: string]: boolean | number | string | undefined;
}

export interface ICategoryRegistration {
  [key: string]: ICategoryForm[];
}

export interface ICategoryForm {
  name: string;
  display: string;
}

export interface ICategoryManagement {
  [key: string]: ICategoryMGMTForm[];
}

export interface ICategoryMGMTForm {
  checked?: boolean;
  number: number;
  name: string;
  display: string;
  [key: string]: boolean | number | string | undefined;
}

export interface ICashCheckForm {
  date: string;
  time: string;
  number: number;
  reserveCash: number;
  cashSalesAmount: number;
  expectedAmount: number;
  countedAmount: number;
  correct: boolean;
  '1000': number;
  '5000': number;
  '10000': number;
  '50000': number;
}
