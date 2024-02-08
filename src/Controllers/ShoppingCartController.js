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
    this.#setPaymentMethod();
    this.#addInitiateButtonEvent();
    this.#renderSelectedMethod();
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
        this.#renderAmountToPay();
      }
    });
  }

  #renderAmountToPay() {
    $('#amount').innerText = formatter.formatNumber(this.#shoppingCartData.gePaymentInfo().chargeAmount);
  }

  #removeDiscountedClass() {
    $('#discount').classList.remove('selected');
    $('#amount').classList.remove('discounted');
  }

  #addControlQuantity() {
    $('#shopping-cart-box').addEventListener('mousedown', (e) => {
      if (e.target.classList.length) {
        const productName = formatter.formatDataSetToText(e.target.closest('.cart-row').dataset.name);
        const { classList } = e.target;
        this.#shoppingCartData.handleQuantity(classList, productName);
        this.#renderShoppingCart();
        this.#removeDiscountedClass();
      }
    });
  }

  #setPaymentMethod() {
    $('#payment-method-box').addEventListener('click', (e) => {
      if (e.target.id === 'discount') return;
      this.#shoppingCartData.updatePaymentMethod(e.target.innerText);
      this.#selectMethod(e.target);
    });
  }

  #deselectAllMethod() {
    const methodButtons = Array.from($('#payment-method-box').querySelectorAll('.payment-method-button')).filter(
      (button) => button.innerText !== '할인적용',
    );
    methodButtons.forEach((button) => button.classList.remove('selected'));
  }

  #selectMethod(target) {
    this.#deselectAllMethod();
    if (target.id === 'discount') return;
    target.classList.add('selected');
  }

  #addInitiateButtonEvent() {
    $('#initiate-button').addEventListener('click', () => {
      this.#shoppingCartData.initShoppingCart();
      this.#shoppingCartData.initPaymentInfo();
      this.#removeDiscountedClass();
      this.#renderShoppingCart();
      this.#renderSelectedMethod();
    });
  }

  #renderSelectedMethod() {
    const buttons = $('#payment-method-box').querySelectorAll('button');
    const { method } = this.#shoppingCartData.gePaymentInfo();
    buttons.forEach((button) => {
      button.classList.remove('selected');
      if (button.innerText === method) button.classList.add('selected');
    });
  }
}

export default ShoppingCartController;
