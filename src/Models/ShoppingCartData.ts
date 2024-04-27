import store from '../../utils/store';
import { ShoppingCartDataInterface } from '../interfaces/ModelInterfaces';
import { ShoppingCartProduct, Product } from '../interfaces/DataInterfaces';

export default class ShoppingCartData implements ShoppingCartDataInterface {
  #shoppingCart: ShoppingCartProduct[];

  constructor() {
    this.#shoppingCart = store.getStorage('shoppingCart') ?? [];
  }

  getShoppingCartData(): ShoppingCartProduct[] {
    return this.#shoppingCart;
  }

  getTotalAmount(): number {
    return this.#shoppingCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  }

  #setShoppingCart() {
    store.setStorage(
      'shoppingCart',
      this.#shoppingCart.filter((product) => product.quantity > 0),
    );
  }

  addToShoppingCart(product: Product) {
    const productToAdd = this.#createProductData(product);
    const existProduct = this.#shoppingCart.find(
      (cartProduct) => cartProduct.number === productToAdd.number,
    );
    if (existProduct) existProduct.quantity += 1;
    else this.#shoppingCart.push(productToAdd);
    this.#setShoppingCart();
  }

  #createProductData(product: Product): ShoppingCartProduct {
    const productToAdd = {
      name: product.name,
      number: Number(product.number),
      price: product.price,
      quantity: 1,
    };
    return productToAdd;
  }

  plusQuantity(productNumber: number) {
    const productToPlus = this.#shoppingCart.find((product) => product.number === productNumber);
    if (productToPlus) {
      productToPlus.quantity += 1;
      this.#setShoppingCart();
    }
  }

  minusQuantity(productNumber: number) {
    const productToMinus = this.#shoppingCart.find((product) => product.number === productNumber);
    if (productToMinus) {
      if (productToMinus.quantity > 1) productToMinus.quantity -= 1;
      else this.deleteFromCart(productNumber);
      this.#setShoppingCart();
    }
  }

  deleteFromCart(productNumber: number) {
    const productToDelete = this.#shoppingCart.find((product) => product.number === productNumber);
    if (productToDelete) {
      productToDelete.quantity = 0;
      this.#shoppingCart = this.#shoppingCart.filter((product) => product.quantity > 0);
      this.#setShoppingCart();
    }
  }

  initShoppingCart() {
    this.#shoppingCart = [];
    this.#setShoppingCart();
  }
}
