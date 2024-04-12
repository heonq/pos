import $ from '../../utils/index.js';
import PaymentModalController from '../core/PaymentModalController.js';
import validator from '../../utils/validator.js';
import splitPaymentModalComponents from '../Views/modalComponents/splitPaymentModalComponents.js';

class SplitPaymentController extends PaymentModalController {
  #shoppingCartData;

  #salesData;

  constructor(shoppingCartData, salesData) {
    super();
    this.#shoppingCartData = shoppingCartData;
    this.#salesData = salesData;
  }

  init() {
    this.#addSplitPaymentRenderEvent();
  }

  #addSplitPaymentRenderEvent() {
    $('#split').addEventListener('click', () => {
      this.#renderSplitPayment();
    });
  }

  #renderSplitPayment() {
    if (!validator.validateTotalAmount(this.#shoppingCartData.getTotalAmount())) return;
    $('#modal-container').innerHTML = splitPaymentModalComponents.renderSplitPaymentComponent(
      this.#salesData.getPaymentInfo(),
    );
    this.#renderSplitInput();
    this.showModal('small');
    this.#addEvents();
  }

  #addEvents() {
    this.#addSplitInputEvent();
    this.addSubmitButtonEvent('split-payment-submit', this.#handleSplitPayment.bind(this));
    this.addCancelButtonEvent();
    this.#addHandleDiscountSubmitEvent();
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

  #handleSplitPayment() {
    const amounts = [$('#first-split-input').value, $('#second-split-input').value];
    const paymentMethods = [$('#first-method').value, $('#second-method').value];
    if (!validator.validateSplitPayment(amounts, this.#salesData.getPaymentInfo().chargeAmount)) return;
    this.#salesData.updatePaymentMethod('분할결제');
    $('#split').classList.add('selected');
    this.#salesData.saveSplitPayment(paymentMethods, amounts);
    this.hideModal();
    this.renderSelectedMethod(this.#salesData);
  }

  #addHandleDiscountSubmitEvent() {
    $('#split-payment-container').addEventListener('change', this.#handleSplitSubmit.bind(this));
  }

  #handleSplitSubmit() {
    const inputComplete = Array.from($('#split-payment-container').querySelectorAll('input')).every(
      (input) => input.value !== '',
    );
    const selectComplete = Array.from($('#split-payment-container').querySelectorAll('select')).every(
      (select) => select.value !== '',
    );
    if (inputComplete && selectComplete) return this.enableSubmitButton('split-payment-submit');
    return this.disableSubmitButton('split-payment-submit');
  }
}

export default SplitPaymentController;
