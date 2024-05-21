import { ICategory, IProduct } from './DataInterfaces';
import { discountTypeEnum } from './enums';

export interface IProductProps {
  categories: ICategory[];
  products: IProduct[];
}

export interface IProductButtonProps {
  product: IProduct;
}

export interface ISalesNumberAndProfileProps {
  onProfileClick(): void;
  showProfileMenu: boolean;
}

export interface IButtonsProps {
  disable: boolean;
}
