import { ICategory, IProduct } from './DataInterfaces';

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
