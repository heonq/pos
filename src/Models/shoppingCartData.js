import store from '../../utils/store.js';

class ShoppingCartData {
  #shoppingCart;

  constructor() {
    this.#updateShoppingCart();
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
  }

  handleQuantity(classList, productName) {
    this.#updateShoppingCart();
    if (classList.contains('plus')) this.#plusQuantity(productName);
    if (classList.contains('minus')) this.#minusQuantity(productName);
    if (classList.contains('delete')) this.#deleteFromCart(productName);
    this.#setShoppingCart();
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
}

export default ShoppingCartData;
