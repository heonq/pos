import { discountTypeEnum, paymentMethodsEnum } from './enums';

export interface IProduct {
  name: string;
  number: number;
  price: number;
  category: number;
  display: boolean;
  barcode: string;
  salesQuantity: number;
}

export interface ICategory {
  name: string;
  number: number;
  display: boolean;
}

export interface IShoppingCartProduct {
  name: string;
  number: number;
  price: number;
  quantity: number;
}

export interface IPaymentInfo {
  method: paymentMethodsEnum | '';
  discountType: discountTypeEnum | '';
  totalAmount: number;
  discountAmount: number;
  discountValue: number;
  chargedAmount: number;
  note: string;
}

export interface ISalesHistory {
  number: number;
  products: IShoppingCartProduct[];
  method: paymentMethodsEnum | '';
  discountType: discountTypeEnum | '';
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
  discountType: discountTypeEnum;
  discountValue: number;
}

export interface IProductRegistration {
  [key: string]: IProductForm[];
}

export interface IProductForm {
  name: string;
  price: number;
  barcode: string;
  category: string;
  display: string;
}
