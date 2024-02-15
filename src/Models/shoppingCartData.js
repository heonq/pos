import store from '../../utils/store.js';
import formatter from '../../utils/formatter.js';
import VALUES from '../../constants/values.js';

class ShoppingCartData {
  #shoppingCart;

  #paymentInfo;

  #splitPayment;

  #salesInfo;

  #salesHistory;

  constructor() {
    this.#updateShoppingCart();
    this.#getPaymentInfoFromStorage();
    this.initSplitPayment();
    this.initSalesHistory();
  }

  getShoppingCartData() {
    this.#updateShoppingCart();
    return this.#shoppingCart;
  }

  getTotalAmount() {
    this.#updateShoppingCart();
    return this.#shoppingCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  }

  #updateShoppingCart() {
    this.#shoppingCart = store.getStorage('shoppingCart') ?? [];
  }

  #setShoppingCart() {
    store.setStorage(
      'shoppingCart',
      this.#shoppingCart.filter((product) => product.quantity > 0),
    );
  }

  addToShoppingCart(product) {
    this.#updateShoppingCart();
    const productToAdd = product;
    productToAdd.quantity = 1;
    const existProduct = this.#shoppingCart.find((cartProduct) => cartProduct.name === productToAdd.name);
    if (existProduct) existProduct.quantity += 1;
    else this.#shoppingCart.push(productToAdd);
    this.#setShoppingCart();
    this.initPaymentInfo();
  }

  handleQuantity(classList, productName) {
    this.#updateShoppingCart();
    if (classList.contains('plus')) this.#plusQuantity(productName);
    if (classList.contains('minus')) this.#minusQuantity(productName);
    if (classList.contains('delete')) this.#deleteFromCart(productName);
    this.#setShoppingCart();
    this.initPaymentInfo();
  }

  #plusQuantity(productName) {
    const productToPlus = this.#shoppingCart.find((product) => product.name === productName);
    productToPlus.quantity += 1;
  }

  #minusQuantity(productName) {
    const productToMinus = this.#shoppingCart.find((product) => product.name === productName);
    if (productToMinus.quantity > 1) productToMinus.quantity -= 1;
    else this.#deleteFromCart(productName);
  }

  #deleteFromCart(productName) {
    const productToDelete = this.#shoppingCart.find((product) => product.name === productName);
    productToDelete.quantity = 0;
  }

  initShoppingCart() {
    this.#shoppingCart = [];
    this.#setShoppingCart();
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
    this.#paymentInfo = {
      method: '',
      discountType: 'percentage',
      totalAmount: this.getTotalAmount(),
      discountAmount: 0,
      discountValue: 0,
      chargeAmount: this.getTotalAmount(),
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
      this.#paymentInfo.discountAmount = Math.floor(discountValue * this.#paymentInfo.totalAmount * 0.01);
    this.#paymentInfo.chargeAmount = this.#paymentInfo.totalAmount - this.#paymentInfo.discountAmount;
  }

  checkDiscountAmount() {
    return this.#paymentInfo.discountAmount > 0;
  }

  checkDiscountType() {
    return this.#paymentInfo.discountType === 'percentage';
  }

  saveSplitPayment(paymentMethod = [], amount = []) {
    this.#splitPayment.methods = paymentMethod;
    this.#splitPayment.amounts = amount;
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
    this.#paymentInfo.ETCReason = reason;
    this.updatePaymentMethod('기타결제');
  }

  initSalesHistory() {
    const dateText = formatter.formatDate(new Date());
    if (!store.getStorage('salesHistories')) store.setStorage('salesHistories', { [dateText]: [] });
    this.#salesHistory = store.getStorage('salesHistories')[dateText] ?? [];
  }

  setSalesInfo() {
    this.initSalesHistory();
    this.initSalesInfo();
    this.handleETCInfo();
    this.handleDiscountInfo();
  }

  initSalesInfo() {
    const date = new Date();
    this.#salesInfo = {
      number: this.#salesHistory.length + 1,
      products: this.#shoppingCart,
      chargeAmount: this.#paymentInfo.chargeAmount,
      method: this.#paymentInfo.method,
      date: formatter.formatDate(date),
      time: formatter.formatTime(date),
      discount: false,
      discountType: '',
      note: '',
    };
  }

  handleETCInfo() {
    if (this.#salesInfo.method === '기타결제') {
      this.#salesInfo.chargeAmount = 0;
      this.#salesInfo.note = this.#paymentInfo.ETCReason;
    }
  }

  handleDiscountInfo() {
    const { discountType } = this.#paymentInfo;
    const { discountValue } = this.#paymentInfo;
    this.#salesInfo.discountValue = discountValue;
    if (this.#paymentInfo.discountValue > 0) {
      this.#salesInfo.discountType = discountType;
      this.#salesInfo.discount = true;
      this.#salesInfo.note = `할인 사유 : ${this.#paymentInfo.discountReason} 할인금액 : ${formatter.formatNumber(
        discountValue,
      )}${VALUES.discountType[discountType]} `;
    }
  }

  handleSalesInfo() {
    this.setSalesInfo();
    if (this.#paymentInfo.method === '분할결제') {
      this.handleSplitPayment();
    } else this.#salesHistory.push(this.#salesInfo);
    const salesHistories = store.getStorage('salesHistories');
    salesHistories[formatter.formatDate(new Date())] = this.#salesHistory;
    store.setStorage('salesHistories', salesHistories);
    this.initPaymentInfo();
  }

  handleSplitPayment() {
    this.initSplitPayment();
    this.#salesInfo.note += `분할결제 : ${this.#salesInfo.number},${this.#salesInfo.number + 1}`;
    this.#splitPayment.amounts.forEach((amount, index) => {
      this.#salesInfo.chargeAmount = amount;
      this.#salesInfo.method = this.#splitPayment.methods[index];
      this.#salesHistory.push({ ...this.#salesInfo });
      this.#salesInfo.products = [];
      this.#salesInfo.number += 1;
    });
  }

  getSalesNumber() {
    this.initSalesHistory();
    return this.#salesHistory[this.#salesHistory.length - 1]?.number ?? 0;
  }
}

export default ShoppingCartData;
