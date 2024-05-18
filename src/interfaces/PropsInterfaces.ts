import { ICategory, IProduct } from './DataInterfaces';

export interface IProductProps {
  categories: ICategory[];
  products: IProduct[];
}

export interface IProductButtonProps {
  product: IProduct;
}
