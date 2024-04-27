import $ from '../../utils/index.js';
import PaymentModalController from '../core/PaymentModalController';
import validator from '../../utils/validator';
import splitPaymentModalComponents from '../Views/modalComponents/splitPaymentModalComponents';
import { PaymentDataInterface, ShoppingCartDataInterface } from '../interfaces/ModelInterfaces';

class SplitPaymentController extends PaymentModalController {
  #shoppingCartData;
  #paymentData;

  constructor(shoppingCartData: ShoppingCartDataInterface, paymentData: PaymentDataInterface) {
    super();
    this.#shoppingCartData = shoppingCartData;
    this.#paymentData = paymentData;
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
      this.#paymentData.getPaymentInfo(),
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
    const paymentMethods = this.#paymentData.getSplitPayment().methods;
    const { amounts } = this.#paymentData.getSplitPayment();
    const inputs = $('#split-payment-container').querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;
    const selects = $('#split-payment-container').querySelectorAll(
      'select',
    ) as NodeListOf<HTMLSelectElement>;
    inputs.forEach((input, index) => (input.value = String(amounts[index])));
    selects.forEach((select, index) => (select.value = paymentMethods[index]));
  }

  #addSplitInputEvent() {
    $('#modal-container').addEventListener('change', (e: Event) => {
      if ((e.target as HTMLElement).classList.contains('split-payment-input')) this.#renderInput(e);
    });
  }

  #renderInput(e: Event) {
    const inputs = ['first-split-input', 'second-split-input'];
    const { chargeAmount } = this.#paymentData.getPaymentInfo();
    const index = inputs.indexOf((e.target as HTMLElement).id);
    $(`#${inputs[1 - index]}`).value = chargeAmount - $(`#${inputs[index]}`).value;
  }

  #handleSplitPayment() {
    const amounts = [$('#first-split-input').value, $('#second-split-input').value];
    const paymentMethods = [$('#first-method').value, $('#second-method').value];
    if (!validator.validateSplitPayment(amounts, this.#paymentData.getPaymentInfo().chargeAmount))
      return;
    this.#paymentData.updatePaymentMethod('분할결제');
    $('#split').classList.add('selected');
    this.#paymentData.saveSplitPayment(paymentMethods, amounts);
    this.hideModal();
  }

  #addHandleDiscountSubmitEvent() {
    $('#split-payment-container').addEventListener('change', this.#handleSplitSubmit.bind(this));
  }

  #handleSplitSubmit() {
    const inputArray = Array.from(
      $('#split-payment-container').querySelectorAll('input'),
    ) as HTMLInputElement[];
    const inputComplete = inputArray.every((input) => input.value !== '');

    const selectArray = Array.from(
      $('#split-payment-container').querySelectorAll('select'),
    ) as HTMLSelectElement[];
    const selectComplete = selectArray.every((select) => select.value !== '');
    if (inputComplete && selectComplete) return this.enableSubmitButton();
    return this.disableSubmitButton();
  }
}

export default SplitPaymentController;
