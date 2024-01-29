/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

import formatter from '../../utils/formatter.js';

const shoppingCartComponents = {
  renderShoppingCart(shoppingCartData) {
    return shoppingCartData
      .map(
        (product, index) => `<div class="cart-row" data-index=${index} data-name=${formatter.formatTextToDataSet(
          product.name,
        )} data-quantity=${product.quantity}>
    <div class="cart-product">
      ${product.name}<br />${formatter.formatNumber(product.price * product.quantity)}원
    </div>
    <div class="quantity-box">
      <div class="minus">-</div>
      <div class="quantity">${product.quantity}</div>
      <div class="plus">+</div>
      <div class="delete">x</div>
    </div>
  </div>
    `,
      )
      .join('');
  },
};

export default shoppingCartComponents;
