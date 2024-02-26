/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import commonModalComponents from './commonModalComponents.js';

const productModalComponents = {
  renderProductRegistration() {
    return `<div id="product-registration-modal">
    <div id="product-registration-container" class="product-container">
    <div id="product-registration-header">
    <span>상품명</span>
    <span>가격</span>
    <span>바코드</span>
    <span>카테고리</span>
    <span>전시여부</span>
    <span>삭제</span>
    </div>
    </div>
    <div>
    <button id="plus-product-input-button">+</button>
    </div>
    </div>
    ${commonModalComponents.renderSubmitAndCancelButtons('product-registration')}
    `;
  },
  renderOptions(select, categories) {
    const options = [];
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.text = category;
      options.push(option);
    });
    options.forEach((option) => select.appendChild(option));
  },

  renderProductInputs() {
    return `<div class="product-registration-row product-inputs-row">
      <div><input class="product-name-input" /></div>
      <div><input class="product-price-input" /></div>
      <div><input class="product-barcode-input" /></div>
      <div><select class="product-categories-select"></select></div>
      <div><select class="product-display-select">
        <option value="true">전시</option>
        <option value="false">숨김</option>
      </select></div>
      <div><button class="product-delete-button">삭제</button></div>
    </div>`;
  },

  renderProductManagementContainer() {
    return `<div id="category-modal-background"></div>
    <div id="product-management-container" class="product-container">
    <div id="category-modal">
    <div id="category-select-container">
    <select id="category-select">
    </select>
    <div id="selected-category-submit-buttons">
    <button id="selected-category-submit">확인</button>
    <button id="selected-category-cancel">취소</button>
    </div>
    </div>
    </div>
      <div id="product-management-buttons-container">
        <select id="product-management-buttons">
          <option value="default" hidden>선택한 상품 수정하기</option>
          <option value="delete-selected">선택한 상품 삭제</option>
          <option value="display-selected">선택한 상품 전시</option>
          <option value="hide-selected">선택한 상품 숨기기</option>
          <option value="change-selected-category">선택한 상품 카테고리 변경</option>
        </select>
        <select id="search-by-category">
          <option value="default">전체카테고리</option>
        </select>
        <select id="search-by-display">
          <option value="default">전체전시상태</option>
          <option value="true">전시</option>
          <option value="false">숨김</option>
        </select>
        <button id="management-search-button">검색</button>
      </div>
      
      <div id="product-list-header">
      <span><input type="checkbox" class="select-total-product-button" /></span>
      <span>상품명</span>
      <span>가격</span>
      <span>바코드</span>
      <span>카테고리</span>
      <span>전시여부</span>
      <span>판매수량</span>
      <span>삭제</span>
      </div>
      <div id="product-list-container"></div>
      
    </div>${commonModalComponents.renderSubmitAndCancelButtons('product-management')}`;
  },

  renderProductsInputs(product) {
    return `<div data-product-number=${product.number} class="product-management-row product-inputs-row">
      <span><input type="checkbox" class="select-product-button" /></span>
      <span><input class="product-name-input" value="${product.name}"></span>
      <span><input class="product-price-input" value="${product.price}"></span>
      <span><input class="product-barcode-input" value="${product.barcode}"></span>
      <span>
      <select data-category=${product.category} class="product-categories-select">
      </select>
      </span>
      <span>
      <select>
      <option class="product-display-true" value="true" ${product.display ? 'selected' : ''}>전시</option>
      <option class="product-display-false" value="false" ${product.display ? '' : 'selected'}>숨김</option>
      </select>
      </span>
      <span>
      ${product.salesQuantity}
      </span>
      <span><button class="product-delete-button">삭제</button></span>
    </div>`;
  },
};

export default productModalComponents;
