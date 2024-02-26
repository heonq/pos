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
    const productToAdd = this.#createProductData(product);
    const existProduct = this.#shoppingCart.find((cartProduct) => cartProduct.number === productToAdd.number);
    if (existProduct) existProduct.quantity += 1;
    else this.#shoppingCart.push(productToAdd);
    this.#setShoppingCart();
  }

  #createProductData(product) {
    const productToAdd = {
      name: product.name,
      number: product.number,
      price: product.price,
      quantity: 1,
    };
    return productToAdd;
  }

  handleQuantity(classList, productNumber) {
    this.#updateShoppingCart();
    if (classList.contains('plus')) this.#plusQuantity(productNumber);
    if (classList.contains('minus')) this.#minusQuantity(productNumber);
    if (classList.contains('delete')) this.#deleteFromCart(productNumber);
    this.#setShoppingCart();
  }

  #plusQuantity(productNumber) {
    const productToPlus = this.#shoppingCart.find((product) => product.number === productNumber);
    productToPlus.quantity += 1;
  }

  #minusQuantity(productNumber) {
    const productToMinus = this.#shoppingCart.find((product) => product.number === productNumber);
    if (productToMinus.quantity > 1) productToMinus.quantity -= 1;
    else this.#deleteFromCart(productNumber);
  }

  #deleteFromCart(productNumber) {
    const productToDelete = this.#shoppingCart.find((product) => product.number === productNumber);
    productToDelete.quantity = 0;
  }

  initShoppingCart() {
    this.#shoppingCart = [];
    this.#setShoppingCart();
  }
}

export default ShoppingCartData;
