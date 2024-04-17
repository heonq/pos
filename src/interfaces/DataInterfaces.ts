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
