import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import ShoppingCartData from '../Models/ShoppingCartData.js';
import formatter from '../../utils/formatter.js';
import validator from '../../utils/validator.js';
import PaymentModalController from '../core/PaymentModalController.js';

class DiscountController extends PaymentModalController {
  #shoppingCartData;

  constructor() {
    super();
    this.#shoppingCartData = new ShoppingCartData();
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
    if (this.#shoppingCartData.getTotalAmount() === 0) return;
    $('#modal-container').innerHTML = modalComponents.renderDiscountComponent(this.#shoppingCartData.getPaymentInfo());
    this.#calculateDiscount();
    this.showModal('small');
    this.#addRadioEvent();
    this.#addInputEvent();
    this.addSubmitButtonEvent('discount-submit', this.#submitDiscount.bind(this));
    this.addSubmitButtonEvent('discount-cancel', this.hideModal.bind(this));
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
    this.#shoppingCartData.updateDiscountType(e.currentTarget.value);
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
    this.#shoppingCartData.updateDiscount(discountValue, discountReason);
    $('#amount').innerText = formatter.formatNumber(this.#shoppingCartData.getPaymentInfo().chargeAmount);
    this.#shoppingCartData.deactivateSplitPayment();
    this.#updateDiscountButtonClass();
    this.renderSelectedMethod(this.#shoppingCartData);
    this.hideModal();
  }

  #updateDiscountButtonClass() {
    if (this.#shoppingCartData.checkDiscountAmount()) {
      $('#discount').classList.add('selected');
      return $('#amount').classList.add('discounted');
    }
    $('#discount').classList.remove('selected');
    return $('#amount').classList.remove('discounted');
  }
}

export default DiscountController;
