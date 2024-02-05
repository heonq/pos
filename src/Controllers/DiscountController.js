import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import ShoppingCartData from '../Models/ShoppingCartData.js';
import modalController from '../core/modalController.js';

class DiscountController extends modalController {
  #discountInfo;

  #shoppingCartData;

  constructor() {
    super();
    this.#shoppingCartData = new ShoppingCartData();
  }

  init() {
    this.#addRenderDiscountModalEvent();
  }

  #addRenderDiscountModalEvent() {
    $('#discount').addEventListener('click', () => {
      this.#renderDiscountModal();
    });
  }

  #renderDiscountModal() {
    if (this.#shoppingCartData.getTotalAmount() === 0) return;
    this.#updateDiscountFromStorage();
    $('#modal-container').innerHTML = modalComponents.renderDiscountComponent(this.#discountInfo);
    this.showModal('small');
  }

  #updateDiscountFromStorage() {
    this.#discountInfo = this.#shoppingCartData.getDiscount() ?? this.#shoppingCartData.initDiscountInfo();
  }
}

export default DiscountController;
