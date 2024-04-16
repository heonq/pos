import { Products, Categories, Product, Category } from '../interfaces/DataInterfaces';
import store from '../../utils/store';
import { ProductDataInterface } from '../interfaces/ModelInterfaces';

export default class ProductData implements ProductDataInterface {
  #categories: Categories;

  #products: Products;

  constructor() {
    this.#products = store.getStorage('products') ?? {};
    this.#categories = store.getStorage('categories');
    if (!this.#categories) {
      this.#categories = {
        1: { name: '카테고리없음', display: true, number: 1 },
      };
      store.setStorage('categories', this.#categories);
    }
  }

  getProducts() {
    return this.#products;
  }

  getCategories() {
    return this.#categories;
  }

  getProductsInOrder() {
    const categories = this.getCategoriesGotProduct();
    return categories.map((category) =>
      Object.values(this.#products).filter(
        (product) =>
          this.convertCategoryNumberToName(product.category) === category &&
          product.display === true,
      ),
    );
  }

  getCategoriesGotProduct() {
    const categoriesGotProduct = [
      ...new Set(
        Object.values(this.#products)
          .filter((product) => product.display === true)
          .map((product) => this.convertCategoryNumberToName(product.category)),
      ),
    ];
    const categoriesOrder = this.getCategoriesInOrder();
    return categoriesOrder.filter((category) => categoriesGotProduct.includes(category));
  }

  getCategoriesInOrder() {
    return Object.values(this.#categories)
      .filter((category) => category.display === true)
      .map((category) => category.name);
  }

  convertCategoryNumberToName(categoryNumber: number) {
    return this.#categories[categoryNumber].name;
  }

  convertCategoryNameToNumber(categoryName: string) {
    return Object.values(this.#categories).find((category) => category.name === categoryName)
      .number;
  }

  deleteProduct(targetNumber: number) {
    delete this.#products[targetNumber];
  }

  deleteCategory(targetNumber: number) {
    delete this.#categories[targetNumber];
  }

  registerProduct(dataToUpdate: Products) {
    this.#products = { ...this.#products, ...dataToUpdate };
    store.setStorage('products', this.#products);
  }

  registerCategory(dataToUpdate: Categories) {
    this.#categories = { ...this.#categories, ...dataToUpdate };
    store.setStorage('categories', this.#categories);
  }

  updateProduct(productNumber: number, updateData: Product) {
    this.#products[productNumber] = { ...this.#products[productNumber], ...updateData };
  }

  updateCategory(categoryNumber: number, updateData: Category) {
    this.#categories[categoryNumber] = { ...this.#categories[categoryNumber], ...updateData };
  }

  getNewestNumber(type: string) {
    return Number(store.getStorage(`newest${type}Number`) ?? (type === 'Category' ? 2 : 1));
  }

  updateNumberHistory(type: string, count: number) {
    const newestNumber = this.getNewestNumber(type) + count;
    store.setStorage(`newest${type}Number`, newestNumber);
  }
}
