import store from '../../utils/store';
import $ from '../../utils/index';
import productComponents from '../Views/productComponents';
import { ProductDataInterface } from '../interfaces/ModelInterfaces';

class ProductsController {
  constructor(private productData: ProductDataInterface) {}

  init() {
    this.renderViewMode();
    this.addRenderEvent();
    this.addSubmitButtonRerenderEvent();
  }

  private addRenderEvent() {
    const methods = [this.renderCategoryMode.bind(this), this.renderTotalMode.bind(this)];
    $('#hidden-view-list')
      .querySelectorAll('div')
      .forEach((button: HTMLElement, index: number) =>
        button.addEventListener('click', methods[index]),
      );
  }

  private renderViewMode() {
    const viewMode: string = store.getStorage('view-mode');
    return viewMode === 'categoryMode' ? this.renderCategoryMode() : this.renderTotalMode();
  }

  private renderCategoryMode() {
    const [categories, products] = [
      this.productData.getCategoriesGotProduct(),
      this.productData.getProductsInOrder(),
    ];
    if (!products.length) this.renderAlertMessage();
    else
      $('#product-container').innerHTML = productComponents.renderTotalCategoryComponent(
        categories,
        products,
      );
  }

  private renderTotalMode(): void {
    const products = this.productData.getProductsInOrder();
    if (!products.length) this.renderAlertMessage();
    else $('#product-container').innerHTML = productComponents.renderTotalModeComponent(products);
  }

  private renderAlertMessage(): void {
    $('#product-container').innerHTML = productComponents.renderAlertMessage();
  }

  private addSubmitButtonRerenderEvent(): void {
    $('#modal-container').addEventListener('click', (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        const classList = target.classList;
        if (classList.contains('rerender')) {
          this.renderViewMode();
        }
      }
    });
  }
}

export default ProductsController;
