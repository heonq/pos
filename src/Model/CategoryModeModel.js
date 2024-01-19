import store from '../../utils/store.js';

const categoryModeModel = {
  getCategories() {
    const categories = store.getStorage('categories');
    return categories
      .sort((a, b) => a.order - b.order)
      .filter((category) => category.display === true)
      .map((category) => category.name);
  },

  getCategoriesGotProduct() {
    const productsArray = this.getProducts();
    return productsArray.map((products) => products[0].category);
  },

  getProducts() {
    const categories = this.getCategories();
    const products = store.getStorage('products');
    return categories.map((category) =>
      products.filter((product) => product.category === category && product.display === true),
    );
  },
};

export default categoryModeModel;
