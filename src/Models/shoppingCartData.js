import store from '../../utils/store.js';

class ShoppingCartData {
  #shoppingCart;

  #paymentInfo;

  constructor() {
    this.#updateShoppingCart();
    this.#getPaymentInfoFromStorage();
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

  gePaymentInfo() {
    this.#getPaymentInfoFromStorage();
    return this.#paymentInfo;
  }

  #setPaymentInfoToStorage() {
    store.setStorage('discountInfo', this.#paymentInfo);
  }

  #getPaymentInfoFromStorage() {
    this.#setDefaultPaymentInfo();
    if (store.getStorage('discountInfo')) this.#paymentInfo = store.getStorage('discountInfo');
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
    if (this.#paymentInfo.type === 'percentage')
      this.#paymentInfo.discountAmount = Math.floor(discountValue * this.#paymentInfo.totalAmount * 0.01);
    this.#paymentInfo.chargeAmount = this.#paymentInfo.totalAmount - this.#paymentInfo.discountAmount;
  }

  checkDiscountAmount() {
    return this.#paymentInfo.discountAmount > 0;
  }

  checkDiscountType() {
    return this.#paymentInfo.discountType === 'category';
  }
}

export default ShoppingCartData;
