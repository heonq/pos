import store from '../../utils/store.js';

class ShoppingCartData {
  #shoppingCart;

  #paymentInfo;

  #splitPayment;

  constructor() {
    this.#updateShoppingCart();
    this.#getPaymentInfoFromStorage();
    this.initSplitPayment();
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
    return this.#paymentInfo.discountType === 'category';
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
}

export default ShoppingCartData;
