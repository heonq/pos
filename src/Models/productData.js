import store from '../../utils/store.js';

class ProductData {
  #categories;

  #products;

  constructor() {
    this.updateTotalProductsFromStorage();
    this.#updateTotalCategoriesFromStorage();
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
      Object.values(this.#products).filter((product) => product.category === category && product.display === true),
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

  deleteProduct(productNumber) {
    delete this.#products[productNumber];
  }

  #updateTotalCategoriesFromStorage() {
    this.#categories = store.getStorage('categories') ?? [];
  }

  getCategoriesGotProduct() {
    this.updateTotalProductsFromStorage();
    this.#updateTotalCategoriesFromStorage();
    const productsArray = Object.values(this.#products).filter((product) => product.display === true);
    const categoriesOrder = this.#categories
      .filter((category) => category.display === true)
      .map((category) => category.name);
    if (!productsArray) return [];
    else {
      const categoriesGotProduct = [...new Set(productsArray.map((products) => products.category))];
      return categoriesOrder.filter((category) => categoriesGotProduct.includes(category));
    }
  }

  deleteProduct(targetNumber) {
    delete this.#products[targetNumber];
  }

  registerProduct(dataToUpdate = {}) {
    this.#products = { ...this.#products, ...dataToUpdate };
    store.setStorage('products', this.#products);
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
