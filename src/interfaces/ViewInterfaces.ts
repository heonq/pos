import { Product, Category } from './DataInterfaces';

export interface ProductComponentsInterface {
  renderEachProduct(product: Product): string;
  renderEachCategoryComponent(category: Category, productsArray: Product[]): string;
  renderTotalCategoryComponent(categories: Category[], productsArrays: Product[][]): string;
  renderTotalModeComponent(productsArrays: Product[][]): string;
  renderAlertMessage(): string;
}
