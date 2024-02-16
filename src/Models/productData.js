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

  #updateTotalCategoriesFromStorage() {
    this.#categories = store.getStorage('categories') ?? [];
  }

  #updateCategoriesGotProduct() {
    this.#updateTotalProductsFromStorage();
    this.#updateTotalCategoriesFromStorage();
    const productsArray = this.#products.filter((product) => (product.display = true));
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
    this.#products = store.getStorage('products') ?? [];
  }

  #updateProductsInOrder() {
    this.#updateCategoriesGotProduct();
    this.#products = this.#categories.map((category) =>
      this.#products.filter((product) => product.category === category),
    );
  }
}

export default ProductData;
