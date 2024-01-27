import store from '../../utils/store.js';

class ShoppingCartData {
  #shoppingCart;

  constructor() {
    this.#getShoppingCart();
  }

  #getShoppingCart() {
    this.#shoppingCart = store.getStorage('shoppingCart') ?? [];
  }

  #setShoppingCart() {
    store.setStorage('shoppingCart', this.#shoppingCart);
  }

  addToShoppingCart(product) {
    this.#getShoppingCart();
    const productToAdd = product;
    productToAdd[quantity] = 1;
    const existProduct = this.#shoppingCart.find((cartProduct) => cartProduct.name === productToAdd.name);
    if (existProduct) existProduct.quantity += 1;
    else this.#shoppingCart.push(productToAdd);
    this.#setShoppingCart();
  }

  plusQuantity(product) {
    this.#getShoppingCart();
    const productToPlus = this.#shoppingCart.find(product);
    productToPlus.quantity += 1;
    this.#setShoppingCart();
  }

  minusQuantity(product) {
    this.#getShoppingCart();
    const productToMinus = this.#shoppingCart.find(product);
    if (productToMinus.quantity > 0) productToMinus.quantity -= 1;
    this.#setShoppingCart();
  }
}

export default ShoppingCartData;
