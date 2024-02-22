/* eslint-disable no-alert */
import ShoppingCartData from '../Models/ShoppingCartData.js';
import shoppingCartComponents from '../Views/shoppingCartComponents.js';
import $ from '../../utils/index.js';
import ProductData from '../Models/productData.js';
import formatter from '../../utils/formatter.js';
import validator from '../../utils/validator.js';
import SalesData from '../Models/salesData.js';

class ShoppingCartController {
  #shoppingCartData;

  #productData;

  #salesData;

  constructor() {
    this.#shoppingCartData = new ShoppingCartData();
    this.#productData = new ProductData();
    this.#salesData = new SalesData();
  }

  init() {
    this.#renderShoppingCart();
    this.#addProductRender();
    this.#addControlQuantity();
    this.#setPaymentMethod();
    this.#addInitiateButtonEvent();
    this.#renderSelectedMethod();
    this.#addETCPayEvent();
    this.#addSaveSalesHistoryEvent();
  }

  #renderShoppingCart() {
    $('#shopping-cart-box').innerHTML = shoppingCartComponents.renderShoppingCart(
      this.#shoppingCartData.getShoppingCartData(),
    );
    this.#renderAmountToPay();
    this.#renderSalesNumber();
    this.#renderSelectedMethod();
  }

  #addProductRender() {
    $('#product-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('product')) {
        const products = this.#productData.getProductsInOrder().flat();
        const name = formatter.formatDataSetToText(e.target.dataset.name);
        const productToAdd = products.find((product) => product.name === name);
        this.#shoppingCartData.addToShoppingCart(productToAdd);
        this.#salesData.initPaymentInfo();
        this.#renderShoppingCart();
        this.#renderAmountToPay();
      }
    });
  }

  #renderAmountToPay() {
    $('#amount').innerText = formatter.formatNumber(this.#salesData.getPaymentInfo().chargeAmount);
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
        this.#salesData.initPaymentInfo();
        this.#renderShoppingCart();
        this.#removeDiscountedClass();
      }
    });
  }

  #setPaymentMethod() {
    $('#first-row').addEventListener('click', (e) => {
      if (!validator.validateTotalAmount(this.#shoppingCartData.getTotalAmount())) return;
      this.#salesData.updatePaymentMethod(e.target.innerText);
      this.#renderSelectedMethod();
    });
  }

  #addInitiateButtonEvent() {
    $('#initiate-button').addEventListener('click', () => {
      this.#initShoppingCartAndPayment();
    });
  }

  #renderSelectedMethod() {
    const buttons = $('#payment-method-box').querySelectorAll('button');
    const { method } = this.#salesData.getPaymentInfo();
    buttons.forEach((button) => {
      if (button.id === 'discount') return;
      button.classList.remove('selected');
      if (button.innerText === method) button.classList.add('selected');
    });
    this.#updateDiscountButtonClass();
  }

  #addETCPayEvent() {
    $('#etcetera').addEventListener('click', () => {
      if (!validator.validateTotalAmount(this.#shoppingCartData.getTotalAmount())) return;
      const reason = prompt('기타 사유를 입력해주세요.');
      this.#salesData.setETCReason(reason);
      this.#renderShoppingCart();
    });
  }

  #addSaveSalesHistoryEvent() {
    $('#payment-complete-button').addEventListener('click', () => {
      if (!validator.validatePaymentMethod(this.#salesData.getPaymentInfo())) return;
      this.#salesData.handleSalesInfo();
      this.#handleProductSalesHistory();
      this.#initShoppingCartAndPayment();
    });
  }

  #handleProductSalesHistory() {
    const products = this.#productData.getTotalProducts();
    const shoppingCart = this.#shoppingCartData.getShoppingCartData();
    shoppingCart.forEach((product) => (products[product.number].salesQuantity += product.quantity));
    this.#productData.registerProduct(products);
  }

  #initShoppingCartAndPayment() {
    this.#shoppingCartData.initShoppingCart();
    this.#salesData.initPaymentInfo();
    this.#salesData.deactivateSplitPayment();
    this.#removeDiscountedClass();
    this.#renderShoppingCart();
    this.#renderSelectedMethod();
    this.#renderSalesNumber();
  }

  #updateDiscountButtonClass() {
    if (this.#salesData.checkDiscountAmount()) {
      $('#discount').classList.add('selected');
      return $('#amount').classList.add('discounted');
    }
    $('#discount').classList.remove('selected');
    return $('#amount').classList.remove('discounted');
  }

  #renderSalesNumber() {
    const salesNumber = this.#salesData.getSalesNumber();
    $('#sales-number').innerText = salesNumber;
  }
}

export default ShoppingCartController;
