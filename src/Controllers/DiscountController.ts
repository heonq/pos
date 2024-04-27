import $ from '../../utils/index.js';
import discountModalComponents from '../Views/modalComponents/discountModalComponent';
import formatter from '../../utils/formatter';
import validator from '../../utils/validator';
import PaymentModalController from '../core/PaymentModalController';
import { PaymentDataInterface, ShoppingCartDataInterface } from '../interfaces/ModelInterfaces';

class DiscountController extends PaymentModalController {
  #shoppingCartData;
  #paymentData;

  constructor(shoppingCartData: ShoppingCartDataInterface, paymentData: PaymentDataInterface) {
    super();
    this.#shoppingCartData = shoppingCartData;
    this.#paymentData = paymentData;
  }

  init() {
    this.#addRenderDiscountModalEvent();
    this.#updateDiscountButtonClass();
  }

  #addRenderDiscountModalEvent() {
    $('#discount').addEventListener('click', () => {
      this.#renderDiscountModal();
    });
  }

  #renderDiscountModal() {
    if (!validator.validateTotalAmount(this.#shoppingCartData.getTotalAmount())) return;
    $('#modal-container').innerHTML = discountModalComponents.renderDiscountComponent(
      this.#paymentData.getPaymentInfo(),
    );
    this.#calculateDiscount();
    this.showModal('small');
    this.#addRadioEvent();
    this.#addInputEvent();
    this.addSubmitButtonEvent('discount-submit', this.#submitDiscount.bind(this));
    this.addSubmitButtonEvent('discount-cancel', this.hideModal.bind(this));
    this.#addHandleDiscountSubmitEvent();
  }

  #addRadioEvent() {
    const radios = $('#select-discount-type-section').querySelectorAll(
      'input',
    ) as HTMLInputElement[];
    radios.forEach((radio) =>
      radio.addEventListener('change', (e) => {
        if ((e.target as HTMLInputElement).checked) this.#handleDiscountType(e);
      }),
    );
  }

  #handleDiscountType(e: Event) {
    const value = (e.currentTarget as HTMLSelectElement).value;
    if (value === 'percentage' || value === 'amount') {
      this.#paymentData.updateDiscountType(value);
      this.#renderDiscountModal();
    }
  }

  #addInputEvent() {
    $('#discount-input').addEventListener('change', () => {
      this.#calculateDiscount();
    });
  }

  #calculateDiscount() {
    const discountValue = $('#discount-input').value;
    const totalAmount = this.#shoppingCartData.getTotalAmount();
    let discountAmount = discountValue;
    if ($('#percentage-type-checkbox').checked) discountAmount *= 0.01 * totalAmount;
    $('#discount-amount').innerText = formatter.formatNumber(Math.floor(discountAmount));
    $('#charge-amount').innerText = formatter.formatNumber(totalAmount - discountAmount);
  }

  #submitDiscount() {
    const discountValue = $('#discount-input').value;
    const discountReason = $('#discount-reason-input').value;
    const totalAmount = this.#shoppingCartData.getTotalAmount();
    const type = $('#percentage-type-checkbox').checked ? 'percentage' : 'amount';
    if (!validator.validateDiscount(type, discountValue, totalAmount)) return;
    this.#paymentData.updateDiscount(discountValue, discountReason);
    $('#amount').innerText = formatter.formatNumber(
      this.#paymentData.getPaymentInfo().chargeAmount,
    );
    this.#paymentData.deactivateSplitPayment();
    this.#updateDiscountButtonClass();
    this.hideModal();
  }

  #updateDiscountButtonClass() {
    if (this.#paymentData.checkDiscountAmount()) {
      $('#discount').classList.add('selected');
      return $('#amount').classList.add('discounted');
    }
    $('#discount').classList.remove('selected');
    return $('#amount').classList.remove('discounted');
  }

  #addHandleDiscountSubmitEvent() {
    const inputArray = $('#discount-info-section').querySelectorAll('input') as HTMLInputElement[];
    inputArray.forEach((input) => {
      input.addEventListener('input', () => {
        this.#handleDiscountSubmit();
      });
    });
  }

  #handleDiscountSubmit() {
    const inputArray = Array.from(
      $('#discount-info-section').querySelectorAll('input'),
    ) as HTMLInputElement[];
    if (inputArray.every((input) => input.value !== '')) return this.enableSubmitButton();
    return this.disableSubmitButton();
  }
}

export default DiscountController;
