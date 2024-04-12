/* eslint-disable no-alert */
import shoppingCartComponents from '../Views/shoppingCartComponents.js';
import $ from '../../utils/index.js';
import formatter from '../../utils/formatter.js';
import validator from '../../utils/validator.js';

class ShoppingCartController {
  #shoppingCartData;

  #productData;

  #salesData;

  constructor(productData, shoppingCartData, salesData) {
    this.#shoppingCartData = shoppingCartData;
    this.#productData = productData;
    this.#salesData = salesData;
  }

  init() {
    this.#renderShoppingCart();
    this.#setTotalProductButtons();
    this.#setButtonsWhenViewModeChange();
    this.#setPaymentMethod();
    this.#addInitiateButtonEvent();
    this.#renderSelectedMethod();
    this.#addETCPayEvent();
    this.#addSaveSalesHistoryEvent();
    this.#addSubmitButtonRerenderEvent();
    this.#addCloseButtonRenderSalesNumberEvent();
  }

  #renderShoppingCart() {
    $('#shopping-cart-box').innerHTML = shoppingCartComponents.renderShoppingCart(
      this.#shoppingCartData.getShoppingCartData(),
    );
    $('#shopping-cart-box')
      .querySelectorAll('.cart-row')
      .forEach((cartList) => this.#addControlQuantityEvent(cartList));
    this.#renderAmountToPay();
    this.#renderSalesNumber();
    this.#renderSelectedMethod();
  }

  #handleProductClick(number) {
    const shoppingCart = this.#shoppingCartData.getShoppingCartData();
    const productIndex = shoppingCart.findIndex((product) => product.number === number);
    const productToAdd = shoppingCart[productIndex];
    if (productToAdd.quantity === 1) this.#addProductToShoppingCart(productToAdd);
    else shoppingCartComponents.rerenderQuantityPrice(productToAdd, productIndex);
  }

  #addProductToShoppingCart(productToAdd) {
    $('#shopping-cart-box').insertAdjacentHTML('beforeend', shoppingCartComponents.renderEachCartProduct(productToAdd));
    const cartListNodes = $('#shopping-cart-box').querySelectorAll('.cart-row');
    const targetNode = cartListNodes[cartListNodes.length - 1];
    this.#addControlQuantityEvent(targetNode);
  }

  #addControlQuantityEvent(cartProductNode) {
    const number = Number(cartProductNode.dataset.number);
    cartProductNode.querySelector('.quantity-box').addEventListener('click', (e) => {
      const shoppingCart = this.#shoppingCartData.getShoppingCartData();
      const index = shoppingCart.findIndex((product) => Number(product.number) === number);
      this.#controlQuantity(e.target.className, shoppingCart[index], index);
      this.#salesData.initPaymentInfo();
      this.#removeDiscountedClass();
    });
  }

  #controlQuantity(className, product, index) {
    if (className === 'plus') this.#handlePlus(product, index);
    if (className === 'minus') this.#handleMinus(product, index);
    if (className === 'delete') this.#handleDelete(product, index);
  }

  #handlePlus(product, index) {
    this.#shoppingCartData.plusQuantity(product.number);
    shoppingCartComponents.rerenderQuantityPrice(product, index);
  }

  #handleMinus(product, index) {
    if (product.quantity > 1) {
      this.#shoppingCartData.minusQuantity(product.number);
      return shoppingCartComponents.rerenderQuantityPrice(product, index);
    }
    return this.#handleDelete(product, index);
  }

  #handleDelete(product, index) {
    shoppingCartComponents.removeCartList(index);
    return this.#shoppingCartData.deleteFromCart(product.number);
  }

  #setButtonsWhenViewModeChange() {
    $('#hidden-view-list')
      .querySelectorAll('div')
      .forEach((div) => div.addEventListener('click', this.#setTotalProductButtons.bind(this)));
  }

  #setTotalProductButtons() {
    $('#product-container')
      .querySelectorAll('.product')
      .forEach((productButton) => {
        this.#addProductClickEvent(productButton);
      });
  }

  #addProductClickEvent(button) {
    const number = Number(button.dataset.number);
    button.addEventListener('click', () => {
      const products = this.#productData.getProductsInOrder().flat();
      const productToAdd = products.find((product) => product.number === number);
      this.#shoppingCartData.addToShoppingCart(productToAdd);
      this.#salesData.initPaymentInfo();
      this.#handleProductClick(number);
      this.#renderAmountToPay();
    });
  }

  #renderAmountToPay() {
    $('#amount').innerText = formatter.formatNumber(this.#salesData.getPaymentInfo().chargeAmount);
  }

  #removeDiscountedClass() {
    $('#discount').classList.remove('selected');
    $('#amount').classList.remove('discounted');
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
      this.#salesData.setSalesHistoryToStorage();
      this.#handleProductSalesHistory();
      this.#initShoppingCartAndPayment();
    });
  }

  #handleProductSalesHistory() {
    const products = this.#productData.getProducts();
    const shoppingCart = this.#shoppingCartData.getShoppingCartData();
    shoppingCart.forEach((product) => {
      products[product.number].salesQuantity += product.quantity;
    });
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

  #addSubmitButtonRerenderEvent() {
    $('#modal-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('rerender')) {
        this.#initShoppingCartAndPayment();
        this.#setTotalProductButtons();
      }
    });
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

  #addCloseButtonRenderSalesNumberEvent() {
    $('#modal-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('sales-history-close-button')) {
        this.#renderSalesNumber();
      }
    });
  }
}

export default ShoppingCartController;
