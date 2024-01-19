/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

import formatter from '../../utils/formatter.js';

const categoryMode = {
  renderCategoryModeComponent(categories, productsArrays) {
    const productsComponentArray = this.rendertotalProducts(productsArrays);
    return `<div id="category-container">
    ${categories
      .map(
        (category, index) => this.renderEachCategoryName(category) + productsComponentArray[index],
      )
      .join('')}
  </div>`;
  },

  renderEachCategoryName(category) {
    return `<div class="category-text">${category}</div>`;
  },

  rendertotalProducts(productsArrays) {
    return productsArrays.map(
      (productsArray) =>
        `<div class="scroll-container">${productsArray
          .map((product) => this.renderEachProduct(product))
          .join('')}</div>`,
    );
  },

  renderEachProduct(product) {
    return `<div class="product-list">
    <div class="product-by-category">
    <span>${product.name}</span>
    <br/ >
    <span>${formatter.formatNumber(product.price)}원</span>
      </div></div>`;
  },
};

export default categoryMode;
