import store from '../../utils/store.js';
import $ from '../../utils/index.js';
import ProductData from '../Models/productData.js';
import productComponents from '../Views/productComponents.js';

class ProductsController {
  #productData;

  constructor() {
    this.#productData = new ProductData();
  }

  init() {
    this.#renderViewMode();
    this.#addRenderEvent();
    this.#addSubmitButtonRerenderEvent();
  }

  #addRenderEvent() {
    const methods = [this.#renderCategoryMode.bind(this), this.#renderTotalMode.bind(this)];
    $('#hidden-view-list')
      .querySelectorAll('div')
      .forEach((button, index) => button.addEventListener('click', methods[index]));
  }

  #renderViewMode() {
    const viewMode = store.getStorage('view-mode');
    return viewMode === 'categoryMode' ? this.#renderCategoryMode() : this.#renderTotalMode();
  }

  #renderCategoryMode() {
    const [categories, products] = [this.#productData.getCategoriesToShow(), this.#productData.getProductsToShow()];
    if (!products.length) this.#renderAlertMessage();
    else $('#product-container').innerHTML = productComponents.renderTotalCategoryComponent(categories, products);
  }

  #renderTotalMode() {
    const products = this.#productData.getProductsToShow();
    if (!products.length) this.#renderAlertMessage();
    else $('#product-container').innerHTML = productComponents.renderTotalModeComponent(products);
  }

  #renderAlertMessage() {
    $('#product-container').innerHTML = productComponents.renderAlertMessage();
  }

  #addSubmitButtonRerenderEvent() {
    $('#modal-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('rerender')) {
        this.#renderViewMode();
      }
    });
  }
}

export default ProductsController;
