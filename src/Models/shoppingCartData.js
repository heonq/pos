import store from '../../utils/store.js';

class ShoppingCartData {
  #shoppingCart;

  #discountInfo;

  constructor() {
    this.#updateShoppingCart();
    this.#setDiscountInfo();
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
    this.#initDiscountInfo();
  }

  handleQuantity(classList, productName) {
    this.#updateShoppingCart();
    if (classList.contains('plus')) this.#plusQuantity(productName);
    if (classList.contains('minus')) this.#minusQuantity(productName);
    if (classList.contains('delete')) this.#deleteFromCart(productName);
    this.#setShoppingCart();
    this.#initDiscountInfo();
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

  #initDiscountInfo() {
    this.#setDefaultDiscountInfo();
    this.#setDiscountToStorage();
    this.#setDiscountInfo();
  }

  getDiscountInfo() {
    this.#setDiscountInfo();
    return this.#discountInfo;
  }

  #setDiscountToStorage() {
    store.setStorage('discountInfo', this.#discountInfo);
  }

  #setDiscountInfo() {
    if (store.getStorage('discountInfo')) this.#discountInfo = store.getStorage('discountInfo');
    else this.#setDefaultDiscountInfo();
  }

  #setDefaultDiscountInfo() {
    this.#discountInfo = {
      type: 'percentage',
      totalAmount: this.getTotalAmount(),
      discountAmount: 0,
      discountValue: 0,
      chargeAmount: this.getTotalAmount(),
      reason: '',
    };
  }

  updateDiscount(discountValue, discountReason) {
    this.updateDiscountValue(discountValue);
    this.#discountInfo.reason = discountReason;
    this.#setDiscountToStorage();
  }

  updateDiscountType(type) {
    this.#setDefaultDiscountInfo();
    this.#discountInfo.type = type;
    this.#setDiscountToStorage();
  }

  updateDiscountValue(discountValue) {
    this.#discountInfo.discountValue = discountValue;
    if (this.#discountInfo.type === 'percentage')
      this.#discountInfo.discountAmount = Math.floor(discountValue * this.#discountInfo.totalAmount * 0.01);
    else this.#discountInfo.discountAmount = discountValue;
    this.#discountInfo.chargeAmount = this.#discountInfo.totalAmount - this.#discountInfo.discountAmount;
    this.#setDiscountToStorage();
  }

  checkDiscountAmount() {
    return this.#discountInfo.discountAmount > 0;
  }

  checkDiscountType() {
    return this.#discountInfo.type === 'category';
  }
}

export default ShoppingCartData;
