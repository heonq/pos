import { Products, Product, Categories, Category } from './DataInterfaces';

export interface ProductDataInterface {
  getProducts(): Products;
  getCategories(): Categories;
  getProductsInOrder(): Product[][];
  getCategoriesGotProduct(): Category[];
  convertCategoryNumberToName(categoryNumber: number): string;
  convertCategoryNameToNumber(categoryName: string): number;
  deleteProduct(targetNumber: number): void;
  deleteCategory(targetNumber: number): void;
  registerProduct(dataToUpdate: Products): void;
  registerCategory(dataToUpdate: Categories): void;
  getNewestNumber(type: string): number;
  updateNumberHistory(type: string, count: number): void;
}
