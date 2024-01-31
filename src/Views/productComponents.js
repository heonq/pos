/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

import formatter from '../../utils/formatter.js';

const productComponents = {
  renderEachProduct(product) {
    return `
    <button class="product" data-name=${formatter.formatTextToDataSet(product.name)} data-price=${product.price}>
    ${product.name}<br />${formatter.formatNumber(product.price)}원
      </button>`;
  },

  renderEachCategoryComponent(category, productsArray) {
    return `<div class="category-text">${category}</div>
    <div class="scroll-container">${productsArray.map((product) => this.renderEachProduct(product)).join('')}</div>`;
  },

  renderTotalCategoryComponent(categories, productsArrays) {
    return productsArrays
      .map((productsArray, index) => this.renderEachCategoryComponent(categories[index], productsArray))
      .join('');
  },

  renderTotalModeComponent(productsArrays) {
    return `<div id="total-product-container">${productsArrays
      .map((products) => products.map((product) => this.renderEachProduct(product)).join(''))
      .join('')}</div>`;
  },

  renderAlertMessage() {
    return `<div id='alert-container'>
        <span>상품이 존재하지 않습니다.</span>
        `;
  },
};

export default productComponents;
