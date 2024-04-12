/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

import formatter from '../../utils/formatter.js';
import $ from '../../utils/index.js';

const shoppingCartComponents = {
  renderShoppingCart(shoppingCartData) {
    return shoppingCartData.map((cartProduct, index) => this.renderEachCartProduct(cartProduct, index)).join('');
  },

  renderEachCartProduct(cartProduct) {
    return `<div class="cart-row" data-number="${cartProduct.number}">
<div class="cart-product">
<div class="product-name">${cartProduct.name}</div>
  <div class="total-price">${formatter.formatNumber(cartProduct.price * cartProduct.quantity)}원
  </div>
</div>
<div class="quantity-box">
  <div class="minus">-</div>
  <div class="quantity">${cartProduct.quantity}</div>
  <div class="plus">+</div>
  <div class="delete">x</div>
</div>
</div>
`;
  },

  rerenderQuantityPrice(cartProduct, index) {
    const cartList = $('#shopping-cart-box').querySelectorAll('.cart-row');
    cartList[index].querySelector('.quantity').innerText = cartProduct.quantity;
    cartList[index].querySelector('.total-price').innerText = `${formatter.formatNumber(
      cartProduct.price * cartProduct.quantity,
    )}원`;
  },

  removeCartList(index) {
    const targetNode = $('#shopping-cart-box').querySelectorAll('.cart-row')[index];
    targetNode.parentNode.removeChild(targetNode);
  },
};

export default shoppingCartComponents;
