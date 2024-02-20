import store from '../../utils/store.js';

class ProductData {
  #categories;

  #products;

  constructor() {
    this.updateDataToShow();
  }

  updateDataToShow() {
    this.#updateCategoriesGotProduct();
    this.#updateProductsInOrder();
  }

  getCategoriesToShow() {
    this.updateDataToShow();
    return this.#categories;
  }

  getProductsToShow() {
    this.updateDataToShow();
    return this.#products;
  }

  getTotalCategories() {
    this.#updateTotalCategoriesFromStorage();
    return this.#categories;
  }

  getTotalProducts() {
    this.#updateTotalProductsFromStorage();
    return this.#products;
  }

  getNewProductNumber() {
    this.#updateTotalProductsFromStorage();
    return (
      Object.keys(this.#products)
        .map(Number)
        .sort((a, b) => b - a)[0] + 1
    );
  }

  #updateTotalCategoriesFromStorage() {
    this.#categories = store.getStorage('categories') ?? [];
  }

  #updateCategoriesGotProduct() {
    this.#updateTotalProductsFromStorage();
    this.#updateTotalCategoriesFromStorage();
    const productsArray = Object.values(this.#products).filter((product) => product.display === true);
    const categoriesOrder = this.#categories
      .filter((category) => category.display === true)
      .map((category) => category.name);
    if (!productsArray) this.#categories = [];
    else {
      const categoriesGotProduct = [...new Set(productsArray.map((products) => products.category))];
      this.#categories = categoriesOrder.filter((category) => categoriesGotProduct.includes(category));
    }
  }

  #updateTotalProductsFromStorage() {
    this.#products = store.getStorage('products') ?? {};
  }

  #updateProductsInOrder() {
    this.#updateCategoriesGotProduct();
    this.#products = this.#categories.map((category) =>
      Object.values(this.#products).filter((product) => product.category === category && product.display === true),
    );
  }

  registerProduct(productsData) {
    this.#products = productsData;
    store.setStorage('products', this.#products);
    this.#updateProductNumberHistory();
  }

  getNewestProductNumber() {
    return Number(store.getStorage('newestProductNumber') ?? 1);
  }

  #updateProductNumberHistory() {
    const newestNumber = this.getNewestProductNumber() + Object.values(this.#products).length;
    store.setStorage('newestProductNumber', newestNumber);
  }
}

export default ProductData;
