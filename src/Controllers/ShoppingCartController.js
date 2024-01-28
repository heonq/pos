import ShoppingCartData from '../Models/ShoppingCartData.js';
import shoppingCartComponents from '../Views/shoppingCartComponents.js';
import $ from '../../utils/index.js';
import productData from '../Models/productData.js';
import formatter from '../../utils/formatter.js';

class ShoppingCartController {
  #shoppingCartData;

  constructor() {
    this.#shoppingCartData = new ShoppingCartData();
  }

  init() {
    this.#renderShoppingCart();
    this.#addProductRender();
    this.#addControlQuantity();
  }

  #renderShoppingCart() {
    $('#shopping-cart-box').innerHTML = shoppingCartComponents.renderShoppingCart(
      this.#shoppingCartData.getShoppingCartData(),
    );
    this.#renderAmountToPay();
  }

  #addProductRender() {
    const products = productData.getProducts();
    $('#product-container').addEventListener('click', (e) => {
      const name = formatter.formatDataSetToText(e.target.dataset.name);
      if (e.target.classList.contains('product')) {
        const productToAdd = products.find((product) => product.name === name);
        this.#shoppingCartData.addToShoppingCart(productToAdd);
        this.#renderShoppingCart();
      }
    });
  }

  #renderAmountToPay() {
    $('#amount').innerText = formatter.formatNumber(this.#shoppingCartData.getTotalAmount());
  }

  #addControlQuantity() {
    $('#shopping-cart-box').addEventListener('mousedown', (e) => {
      const productName = formatter.formatDataSetToText(e.target.closest('.cart-row').dataset.name);
      if (e.target.classList.contains('plus')) this.#shoppingCartData.plusQuantity(productName);
      if (e.target.classList.contains('minus')) this.#shoppingCartData.minusQuantity(productName);
      this.#renderShoppingCart();
    });
  }
}

export default ShoppingCartController;
