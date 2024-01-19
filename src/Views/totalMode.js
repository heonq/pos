/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

import formatter from '../../utils/formatter.js';

const totalMode = {
  renderTotalModeComponent(productsArrays) {
    return `<div id="total-product-container">
    ${this.renderTotalModeProduct(productsArrays)}
</div>`;
  },

  renderTotalModeProduct(productsArrays) {
    return productsArrays
      .map((products) =>
        products
          .map(
            (product) => `<div class="product-total">
      <span>${product.name}</span><br/ ><span>${formatter.formatNumber(product.price)}원</span>
  </div>`,
          )
          .join(''),
      )
      .join('');
  },
};

export default totalMode;
