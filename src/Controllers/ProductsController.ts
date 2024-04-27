import store from '../../utils/store';
import $ from '../../utils/index';
import productComponents from '../Views/productComponents';
import { ProductDataInterface } from '../interfaces/ModelInterfaces';

class ProductsController {
  #productData;

  constructor(productData: ProductDataInterface) {
    this.#productData = productData;
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
      .forEach((button: HTMLElement, index: number) =>
        button.addEventListener('click', methods[index]),
      );
  }

  #renderViewMode() {
    const viewMode: string = store.getStorage('view-mode');
    return viewMode === 'categoryMode' ? this.#renderCategoryMode() : this.#renderTotalMode();
  }

  #renderCategoryMode() {
    const [categories, products] = [
      this.#productData.getCategoriesGotProduct(),
      this.#productData.getProductsInOrder(),
    ];
    if (!products.length) this.#renderAlertMessage();
    else
      $('#product-container').innerHTML = productComponents.renderTotalCategoryComponent(
        categories,
        products,
      );
  }

  #renderTotalMode(): void {
    const products = this.#productData.getProductsInOrder();
    if (!products.length) this.#renderAlertMessage();
    else $('#product-container').innerHTML = productComponents.renderTotalModeComponent(products);
  }

  #renderAlertMessage(): void {
    $('#product-container').innerHTML = productComponents.renderAlertMessage();
  }

  #addSubmitButtonRerenderEvent(): void {
    $('#modal-container').addEventListener('click', (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        const classList = target.classList;
        if (classList.contains('rerender')) {
          this.#renderViewMode();
        }
      }
    });
  }
}

export default ProductsController;
