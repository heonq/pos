import store from '../../utils/store.js';
import $ from '../../utils/index.js';
import productDataModel from '../Models/productData.js';
import productComponents from '../Views/productComponents.js';

class ProductsController {
  init() {
    this.#renderViewMode();
    this.#addRenderEvent();
  }

  #addRenderEvent() {
    const methods = [this.#renderCategoryMode, this.#renderTotalMode];
    $('#hidden-view-list')
      .querySelectorAll('div')
      .forEach((button, index) => button.addEventListener('click', methods[index]));
  }

  #renderViewMode() {
    const viewMode = store.getStorage('view-mode');
    return viewMode === 'categoryMode' ? this.#renderCategoryMode() : this.#renderTotalMode();
  }

  #renderCategoryMode() {
    const [categories, products] = [productDataModel.getCategoriesGotProduct(), productDataModel.getProductsInOrder()];
    if (!products.length) return this.#renderAlertMessage();
    $('#product-container').innerHTML = productComponents.renderTotalCategoryComponent(categories, products);
  }

  #renderTotalMode() {
    const productsArrays = productDataModel.getProductsInOrder();
    if (!productsArrays.length) return this.#renderAlertMessage();
    $('#product-container').innerHTML = productComponents.renderTotalModeComponent(productsArrays);
  }

  #renderAlertMessage() {
    $('#product-container').innerHTML = productComponents.renderAlertMessage();
  }
}

export default ProductsController;
