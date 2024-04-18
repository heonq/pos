import { Product, Category, ShoppingCartProduct } from './DataInterfaces';

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
