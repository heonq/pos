import store from '../../utils/store.js';

class ProductData {
  #categories;

  #products;

  constructor() {
    this.updateTotalProductsFromStorage();
    this.updateTotalCategoriesFromStorage();
  }

  getProducts() {
    return this.#products;
  }

  getCategories() {
    return this.#categories;
  }

  updateTotalProductsFromStorage() {
    this.#products = store.getStorage('products') ?? {};
  }

  getProductsInOrder() {
    const categories = this.getCategoriesGotProduct();
    return categories.map((category) =>
      Object.values(this.#products).filter(
        (product) => this.convertCategoryNumberToName(product.category) === category && product.display === true,
      ),
    );
  }

  getNewProductNumber() {
    this.updateTotalProductsFromStorage();
    return (
      Object.keys(this.#products)
        .map(Number)
        .sort((a, b) => b - a)[0] + 1
    );
  }

  updateProduct(productNumber, updateData) {
    this.#products[productNumber] = { ...this.#products[productNumber], ...updateData };
  }

  updateCategory(categoryNumber, updateData) {
    this.#categories[categoryNumber] = { ...this.#categories[categoryNumber], ...updateData };
  }

  updateTotalCategoriesFromStorage() {
    this.#categories = store.getStorage('categories') ?? { 1: { name: '카테고리없음', display: true, number: 1 } };
  }

  getCategoriesGotProduct() {
    this.updateTotalProductsFromStorage();
    this.updateTotalCategoriesFromStorage();
    const categoriesGotProduct = [
      ...new Set(
        Object.values(this.#products)
          .filter((product) => product.display === true)
          .map((product) => this.convertCategoryNumberToName(product.category)),
      ),
    ];
    const categoriesOrder = Object.values(this.#categories)
      .filter((category) => category.display === true)
      .map((category) => category.name);
    return categoriesOrder.filter((category) => categoriesGotProduct.includes(category));
  }

  convertCategoryNumberToName(categoryNumber) {
    this.updateTotalCategoriesFromStorage();
    return this.#categories[categoryNumber].name;
  }

  convertCategoryNameToNumber(categoryName) {
    this.updateTotalCategoriesFromStorage();
    return Object.values(this.#categories).find((category) => category.name === categoryName);
  }

  deleteProduct(targetNumber) {
    delete this.#products[targetNumber];
  }

  deleteCategory(targetNumber) {
    delete this.#categories[targetNumber];
  }

  registerProduct(dataToUpdate = {}) {
    this.#products = { ...this.#products, ...dataToUpdate };
    store.setStorage('products', this.#products);
  }

  registerCategory(dataToUpdate = {}) {
    this.#categories = { ...this.#categories, ...dataToUpdate };
    store.setStorage('categories', this.#categories);
  }

  getNewestProductNumber() {
    return Number(store.getStorage('newestProductNumber') ?? 1);
  }

  updateProductNumberHistory(productCount) {
    const newestNumber = this.getNewestProductNumber() + productCount;
    store.setStorage('newestProductNumber', newestNumber);
  }
}

export default ProductData;
