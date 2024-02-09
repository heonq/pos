import ShoppingCartData from '../Models/ShoppingCartData.js';
import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import PaymentModalController from '../core/PaymentModalController.js';
import validator from '../../utils/validator.js';

class SplitPaymentController extends PaymentModalController {
  #shoppingCartData;

  constructor() {
    super();
    this.#shoppingCartData = new ShoppingCartData();
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
    $('#modal-container').innerHTML = modalComponents.renderSplitPaymentComponent(
      this.#shoppingCartData.getPaymentInfo(),
    );
    this.#renderSplitInput();
    this.showModal('small');
  }

  #renderSplitInput() {
    const paymentMethods = this.#shoppingCartData.getSplitPayment().methods;
    const { amounts } = this.#shoppingCartData.getSplitPayment();
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
    const { chargeAmount } = this.#shoppingCartData.getPaymentInfo();
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
    if (!validator.validateSplitPayment(paymentMethods, amounts, this.#shoppingCartData.getPaymentInfo().chargeAmount))
      return;
    this.#shoppingCartData.updatePaymentMethod('분할결제');
    $('#split').classList.add('selected');
    this.#shoppingCartData.saveSplitPayment(paymentMethods, amounts);
    this.hideModal();
    this.renderSelectedMethod(this.#shoppingCartData);
  }
}

export default SplitPaymentController;
