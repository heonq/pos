import ShoppingCartData from '../Models/ShoppingCartData.js';
import shoppingCartComponents from '../Views/shoppingCartComponents.js';
import $ from '../../utils/index.js';
import ProductData from '../Models/productData.js';
import formatter from '../../utils/formatter.js';
import modalComponents from '../Views/modalComponents.js';

class ShoppingCartController {
  #shoppingCartData;

  #productData;

  #paymentMethod;

  constructor() {
    this.#shoppingCartData = new ShoppingCartData();
    this.#productData = new ProductData();
  }

  init() {
    this.#renderShoppingCart();
    this.#addProductRender();
    this.#addControlQuantity();
    this.#setPaymentMethod();
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
    $('#amount').innerText = formatter.formatNumber(this.#shoppingCartData.getDiscountInfo().chargeAmount);
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
      this.#paymentMethod = e.target.innerText;
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
}

export default ShoppingCartController;
