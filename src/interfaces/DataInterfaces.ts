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
