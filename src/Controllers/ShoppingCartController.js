import ShoppingCartData from '../Models/ShoppingCartData.js';
import shoppingCartComponents from '../Views/shoppingCartComponents.js';
import $ from '../../utils/index.js';
import ProductData from '../Models/productData.js';
import formatter from '../../utils/formatter.js';

class ShoppingCartController {
  #shoppingCartData;

  #productData;

  constructor() {
    this.#shoppingCartData = new ShoppingCartData();
    this.#productData = new ProductData();
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
    const products = this.#productData.getProducts().flat();
    $('#product-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('product')) {
        const name = formatter.formatDataSetToText(e.target.dataset.name);
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
