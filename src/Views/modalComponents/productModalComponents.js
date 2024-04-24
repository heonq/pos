/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import commonModalComponents from './commonModalComponents.js';
import formatter from '../../../utils/formatter';

const productModalComponents = {
  renderProductRegistration() {
    return `
    <div id="product-registration-container" class="product-container">
    <div><h3>상품등록</h3></div>
    <div id="product-registration-table-container">
    <table id="product-registration-table">
    <thead>
    <tr id="product-registration-header">
    <th>상품명</th>
    <th>가격</th>
    <th>바코드</th>
    <th>카테고리</th>
    <th>전시여부</th>
    <th>삭제</th>
    </tr>
    </thead>
    <tbody id="product-registration-table-body"></tbody>
    </table>
    <div id="plus-product-input-button-container">
    <button id="plus-product-input-button">+</button>
    </div>
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
    return `<tr class="product-registration-row">
      <td><input class="product-name-input" /></td>
      <td><input class="product-price-input" /></td>
      <td><input class="product-barcode-input" /></td>
      <td><select class="product-categories-select"></select></td>
      <td><select class="product-display-select">
        <option value="true">전시</option>
        <option value="false">숨김</option>
      </select></td>
      <td><button class="product-delete-button">삭제</button></td>
    </tr>`;
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
    <div><h3>상품 관리</h3></div>
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
      <div id="product-management-table-container">
      <table id="product-management-table">
      <thead id="product-list-header">
        <tr>
      <th><input type="checkbox" class="select-total-product-button" /></th>
      <th>상품명</th>
      <th>가격</th>
      <th>바코드</th>
      <th>카테고리</th>
      <th>전시여부</th>
      <th>판매수량</th>
      <th>삭제</th>
      </tr>
      </thead>
      <tbody id="product-list-container"></tbody>
      </table>
      </div>
    </div>${commonModalComponents.renderSubmitAndCancelButtons('product-management')}`;
  },

  renderProductsInputs(product) {
    return `<tr data-product-number=${product.number} class="product-management-row product-inputs-row">
      <td><input type="checkbox" class="select-product-button" /></td>
      <td><input class="product-name-input" value="${product.name}"></td>
      <td><input class="product-price-input" value="${product.price}"></td>
      <td><input class="product-barcode-input" value="${product.barcode}"></td>
      <td>
      <select data-category=${product.category} class="product-categories-select">
      </select>
      </td>
      <td>
      <select>
      <option class="product-display-true" value="true" ${product.display ? 'selected' : ''}>전시</option>
      <option class="product-display-false" value="false" ${product.display ? '' : 'selected'}>숨김</option>
      </select>
      </td>
      <td>
      ${formatter.formatNumber(product.salesQuantity)}
      </td>
      <td><button class="product-delete-button">삭제</button></td>
    </tr>`;
  },
};

export default productModalComponents;
