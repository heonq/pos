/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

import formatter from '../../utils/formatter.js';

const productComponents = {
  renderCategoryText(category) {
    return `<div class="category-text">${category}</div>`;
  },

  renderEachProduct(product) {
    return `
    <div class="product-by-category" data-name=${product.name.replace(' ', '_')} data-price=${product.price}>
    <span>${product.name}</span>
    <br/ >
    <span>${formatter.formatNumber(product.price)}원</span>
      </div>`;
  },

  renderEachCategoryComponent(category, productsArray) {
    return `${this.renderCategoryText(category)}
    <div class="scroll-container">${productsArray.map((product) => this.renderEachProduct(product)).join('')}</div>`;
  },

  renderTotalCategoryComponent(categories, productsArrays) {
    return productsArrays
      .map((productsArray, index) => this.renderEachCategoryComponent(categories[index], productsArray))
      .join('');
  },

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

  renderAlertMessage() {
    return `<div id='alert-container'>
        <span>상품이 존재하지 않습니다.</span>
        `;
  },
};

export default productComponents;
