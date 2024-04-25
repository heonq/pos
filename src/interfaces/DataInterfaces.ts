import { PaymentMethod, DiscountType } from '../Types/Types';

export interface Products {
  [key: number]: Product;
}

export interface Product {
  name: string;
  price: number;
  barcode: string | number;
  category: number;
  display: boolean;
  number: number;
  salesQuantity: number;
}

export interface Categories {
  [key: number]: Category;
}

export interface Category {
  name: string;
  display: boolean;
  number: number;
}

export interface ShoppingCartProduct {
  name: string;
  number: number;
  price: number;
  quantity: number;
}

export interface PaymentInfo {
  method: PaymentMethod;
  discountType: DiscountType;
  totalAmount: number;
  discountAmount: number;
  discountValue: number;
  chargeAmount: number;
  discountReason: string;
  ETCReason: string;
}

export interface SplitPayment {
  methods: string[];
  amounts: number[];
}

export interface SalesInfo {
  number: number;
  products: ShoppingCartProduct[];
  chargeAmount: number;
  method: string;
  date: string;
  time: string;
  discount: boolean;
  discountValue: number;
  refund: boolean;
  discountType: DiscountType;
  note: string;
}

export interface CashCheck {
  time: string;
  pettyCash: number;
  cashSalesAmount: number;
  currency: Currency;
  countedAmount: number;
  expectedAmount: number;
  correctBoolean: boolean;
  [key: string]: number | string | boolean | Currency;
}

interface Currency {
  1000: number;
  5000: number;
  10000: number;
  50000: number;
  [key: number]: number;
}
