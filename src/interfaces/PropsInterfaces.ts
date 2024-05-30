import { ICategory, IProduct, IProductForm } from './DataInterfaces';

export interface IProductProps {
  categories: ICategory[];
  products: IProduct[];
}

export interface IProductButtonProps {
  product: IProduct;
}

export interface ISalesNumberAndProfileProps {
  onProfileClick(e: React.MouseEvent): void;
  profileMenuVisible: boolean;
}

export interface IButtonsProps {
  disable: boolean;
}

export interface ViewModeManagementMenusProp {
  onViewModeMenuClick(e: React.MouseEvent): void;
  onViewModeSelect(mode: 'category' | 'total'): void;
  viewMode: string;
  viewModeMenuVisible: boolean;
}

export interface IModalMenuButtonsProps {
  onProductMenuClick(e: React.MouseEvent): void;
  productMenuVisible: boolean;
}

export interface ITableRowProps<T> {
  field: T;
  index: number;
  remove: (index: number) => void;
  categories: ICategory[];
  removable?: boolean;
}
