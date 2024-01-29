import store from '../../utils/store.js';

class ProductData {
  #categories;

  #products;

  constructor() {
    this.updateData();
  }

  updateData() {
    this.#updateCategoriesGotProduct();
    this.#updateProductsInOrder();
  }

  getCategories() {
    this.updateData();
    return this.#categories;
  }

  getProducts() {
    this.updateData();
    return this.#products;
  }

  #getCategoriesOrderFromStorage() {
    const categories = store.getStorage('categories');
    if (!categories) return [];
    return categories
      .sort((a, b) => a.order - b.order)
      .filter((category) => category.display === true)
      .map((category) => category.name);
  }

  #updateCategoriesGotProduct() {
    const productsArray = this.#getProductsFromStorage();
    const categoriesOrder = this.#getCategoriesOrderFromStorage();
    if (!productsArray) this.#categories = [];
    else {
      const categoriesGotProduct = [...new Set(productsArray.map((products) => products.category))];
      this.#categories = categoriesOrder.filter((category) => categoriesGotProduct.includes(category));
    }
  }

  #getProductsFromStorage() {
    const products = store.getStorage('products');
    if (!products) return products;
    return products.filter((product) => product.display === true);
  }

  #updateProductsInOrder() {
    this.#updateCategoriesGotProduct();
    const products = this.#getProductsFromStorage();
    this.#products = this.#categories.map((category) => products.filter((product) => product.category === category));
  }
}

export default ProductData;
