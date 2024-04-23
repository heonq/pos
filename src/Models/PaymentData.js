import store from '../../utils/store.js';

class PaymentData {
  #paymentInfo;

  #splitPayment;

  constructor() {
    this.#getPaymentInfoFromStorage();
    this.initSplitPayment();
  }

  initPaymentInfo() {
    this.#setDefaultPaymentInfo();
    this.#setPaymentInfoToStorage();
  }

  getPaymentInfo() {
    this.#getPaymentInfoFromStorage();
    return this.#paymentInfo;
  }

  #setPaymentInfoToStorage() {
    store.setStorage('paymentInfo', this.#paymentInfo);
  }

  #getPaymentInfoFromStorage() {
    this.#setDefaultPaymentInfo();
    if (store.getStorage('paymentInfo')) this.#paymentInfo = store.getStorage('paymentInfo');
  }

  #setDefaultPaymentInfo() {
    const shoppingCart = store.getStorage('shoppingCart') ?? [];
    const totalAmount = shoppingCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    this.#paymentInfo = {
      method: '',
      discountType: 'percentage',
      totalAmount,
      discountAmount: 0,
      discountValue: 0,
      chargeAmount: totalAmount,
      discountReason: '',
      ETCReason: '',
    };
  }

  updatePaymentMethod(method) {
    this.#getPaymentInfoFromStorage();
    this.#paymentInfo.method = method;
    this.#setPaymentInfoToStorage();
  }

  updateDiscount(discountValue, discountReason) {
    this.updateDiscountValue(discountValue);
    this.#paymentInfo.discountReason = discountReason;
    this.#setPaymentInfoToStorage();
  }

  updateDiscountType(type) {
    this.#setDefaultPaymentInfo();
    this.#paymentInfo.discountType = type;
    this.#setPaymentInfoToStorage();
  }

  updateDiscountValue(discountValue) {
    this.#paymentInfo.discountValue = discountValue;
    this.#paymentInfo.discountAmount = discountValue;
    if (this.#paymentInfo.discountType === 'percentage')
      this.#paymentInfo.discountAmount = Math.floor(
        discountValue * this.#paymentInfo.totalAmount * 0.01,
      );
    this.#paymentInfo.chargeAmount =
      this.#paymentInfo.totalAmount - this.#paymentInfo.discountAmount;
  }

  checkDiscountAmount() {
    return this.#paymentInfo.discountAmount > 0;
  }

  checkDiscountType() {
    return this.#paymentInfo.discountType === 'percentage';
  }

  saveSplitPayment(paymentMethod = [], amount = []) {
    this.#splitPayment.methods = paymentMethod;
    this.#splitPayment.amounts = amount.map(Number);
    store.setStorage('splitPayment', this.#splitPayment);
  }

  setDefaultSplitPayment() {
    this.#splitPayment = {
      methods: [],
      amounts: [],
    };
  }

  deactivateSplitPayment() {
    this.setDefaultSplitPayment();
    this.updatePaymentMethod('');
    store.setStorage('splitPayment', this.#splitPayment);
  }

  initSplitPayment() {
    this.setDefaultSplitPayment();
    if (store.getStorage('splitPayment')) this.#splitPayment = store.getStorage('splitPayment');
  }

  getSplitPayment() {
    this.initSplitPayment();
    return this.#splitPayment;
  }

  setETCReason(reason) {
    this.initPaymentInfo();
    this.updatePaymentMethod('기타결제');
    this.#paymentInfo.ETCReason = reason;
    this.#setPaymentInfoToStorage();
  }
}

export default PaymentData;
