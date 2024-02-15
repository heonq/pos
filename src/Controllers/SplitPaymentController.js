import ShoppingCartData from '../Models/ShoppingCartData.js';
import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import PaymentModalController from '../core/PaymentModalController.js';
import validator from '../../utils/validator.js';
import SalesData from '../Models/salesData.js';

class SplitPaymentController extends PaymentModalController {
  #shoppingCartData;

  #salesData;

  constructor() {
    super();
    this.#shoppingCartData = new ShoppingCartData();
    this.#salesData = new SalesData();
  }

  init() {
    this.#addSplitPaymentRenderEvent();
  }

  #addSplitPaymentRenderEvent() {
    $('#split').addEventListener('click', () => {
      this.#renderSplitPayment();
      this.#addSplitInputEvent();
      this.#addSubmitEvent();
    });
  }

  #renderSplitPayment() {
    if (!validator.validateTotalAmount(this.#shoppingCartData.getTotalAmount())) return;
    $('#modal-container').innerHTML = modalComponents.renderSplitPaymentComponent(this.#salesData.getPaymentInfo());
    this.#renderSplitInput();
    this.showModal('small');
  }

  #renderSplitInput() {
    const paymentMethods = this.#salesData.getSplitPayment().methods;
    const { amounts } = this.#salesData.getSplitPayment();
    const inputs = $('#split-payment-container').querySelectorAll('input');
    const selects = $('#split-payment-container').querySelectorAll('select');
    inputs.forEach((input, index) => (input.value = amounts[index]));
    selects.forEach((select, index) => (select.value = paymentMethods[index]));
  }

  #addSplitInputEvent() {
    $('#modal-container').addEventListener('change', (e) => {
      if (e.target.classList.contains('split-payment-input')) this.#renderInput(e);
    });
  }

  #renderInput(e) {
    const inputs = ['first-split-input', 'second-split-input'];
    const { chargeAmount } = this.#salesData.getPaymentInfo();
    const index = inputs.indexOf(e.target.id);
    $(`#${inputs[1 - index]}`).value = chargeAmount - $(`#${inputs[index]}`).value;
  }

  #addSubmitEvent() {
    this.addSubmitButtonEvent('split-payment-submit', () => {
      this.#handleSplitPayment();
    });
    this.addSubmitButtonEvent('split-payment-cancel', this.hideModal);
  }

  #handleSplitPayment() {
    const amounts = [$('#first-split-input').value, $('#second-split-input').value];
    const paymentMethods = [$('#first-method').value, $('#second-method').value];
    if (!validator.validateSplitPayment(paymentMethods, amounts, this.#salesData.getPaymentInfo().chargeAmount)) return;
    this.#salesData.updatePaymentMethod('분할결제');
    $('#split').classList.add('selected');
    this.#salesData.saveSplitPayment(paymentMethods, amounts);
    this.hideModal();
    this.renderSelectedMethod(this.#salesData);
  }
}

export default SplitPaymentController;
