import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import ShoppingCartData from '../Models/ShoppingCartData.js';
import formatter from '../../utils/formatter.js';
import validator from '../../utils/validator.js';
import PaymentModalController from '../core/PaymentModalController.js';
import SalesData from '../Models/salesData.js';

class DiscountController extends PaymentModalController {
  #shoppingCartData;

  #salesData;

  constructor() {
    super();
    this.#shoppingCartData = new ShoppingCartData();
    this.#salesData = new SalesData();
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
    $('#modal-container').innerHTML = modalComponents.renderDiscountComponent(this.#salesData.getPaymentInfo());
    this.#calculateDiscount();
    this.showModal('small');
    this.#addRadioEvent();
    this.#addInputEvent();
    this.addSubmitButtonEvent('discount-submit', this.#submitDiscount.bind(this));
    this.addSubmitButtonEvent('discount-cancel', this.hideModal.bind(this));
    this.#addHandleDiscountSubmitEvent();
  }

  #addRadioEvent() {
    const radios = $('#select-discount-type-section').querySelectorAll('input');
    radios.forEach((radio) =>
      radio.addEventListener('change', (e) => {
        if (e.currentTarget.checked) this.#handleDiscountType(e);
      }),
    );
  }

  #handleDiscountType(e) {
    this.#salesData.updateDiscountType(e.currentTarget.value);
    this.#renderDiscountModal();
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
    this.#salesData.updateDiscount(discountValue, discountReason);
    $('#amount').innerText = formatter.formatNumber(this.#salesData.getPaymentInfo().chargeAmount);
    this.#salesData.deactivateSplitPayment();
    this.#updateDiscountButtonClass();
    this.renderSelectedMethod(this.#salesData);
    this.hideModal();
  }

  #updateDiscountButtonClass() {
    if (this.#salesData.checkDiscountAmount()) {
      $('#discount').classList.add('selected');
      return $('#amount').classList.add('discounted');
    }
    $('#discount').classList.remove('selected');
    return $('#amount').classList.remove('discounted');
  }

  #addHandleDiscountSubmitEvent() {
    $('#discount-info-section')
      .querySelectorAll('input')
      .forEach((input) => {
        input.addEventListener('input', () => {
          this.#handleDiscountSubmit();
        });
      });
  }

  #handleDiscountSubmit() {
    if (Array.from($('#discount-info-section').querySelectorAll('input')).every((input) => input.value !== ''))
      return this.enableSubmitButton();
    return this.disableSubmitButton();
  }
}

export default DiscountController;
