import store from '../../utils/store.js';

const productDataModel = {
  getCategoriesOrder() {
    const categories = store.getStorage('categories');
    if (!categories) return [];
    return categories
      .sort((a, b) => a.order - b.order)
      .filter((category) => category.display === true)
      .map((category) => category.name);
  },

  getCategoriesGotProduct() {
    const productsArray = this.getProducts();
    const categoriesOrder = this.getCategoriesOrder();
    if (!productsArray) return [];
    const categoriesGotProduct = [...new Set(productsArray.map((products) => products.category))];
    return categoriesOrder.filter((category) => categoriesGotProduct.includes(category));
  },

  getProducts() {
    const products = store.getStorage('products');
    if (!products) return products;
    return products.filter((product) => product.display === true);
  },

  getProductsInOrder() {
    const categoriesOrder = this.getCategoriesGotProduct();
    const products = this.getProducts();
    return categoriesOrder.map((category) => products.filter((product) => product.category === category));
  },
};

export default productDataModel;
