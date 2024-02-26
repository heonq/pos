/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import commonModalComponents from './commonModalComponents.js';

const categoryModalComponents = {
  renderCategoryManagementModal() {
    return `<div id="category-management-container">
          <div id="category-management-buttons-container">
            <select id="category-management-buttons">
            <option value="default" hidden>선택한 카테고리 수정</option>
              <option value="delete-selected-categories">선택한 카테고리 삭제</option>
              <option value="display-selected-categories">선택한 카테고리 전시</option>
              <option value="hide-selected-categories">선택한 카테고리 숨기기</option>
            </select>
          </div>
          <div id="category-management-header">
            <span>
              <input id="select-total-category-button" type="checkbox" />
            </span>
            <span>카테고리 이름</span>
            <span>전시여부</span>
            <span>삭제</span>
          </div>
          <div id="category-management-list-container"></div>
          ${commonModalComponents.renderSubmitAndCancelButtons('category-management')}
        </div>`;
  },
  renderCategoryRow(category) {
    return `<div data-category-number=${category.number} class="category-management-row">
          <span><input type="checkbox" class="category-select-button" /></span>
          <span><input type="text" class="category-name-input" value=${category.name}></span>
          <span>
          <select>
          <option class="category-display-true" value="true" ${
            category.display === true ? 'selected' : ''
          }>전시</option>
          <option class="category-display-false" value="false" ${
            category.display === true ? '' : 'selected'
          }>숨기기</option>
          </select>
          </span>
          <span>
          <button class="delete-category-button">삭제</button>
          </span>
        </div>`;
  },

  renderCategoryRegistrationModal() {
    return `<div id="category-registration-container">
      <div id="category-registration-list-container">
      <div id="category-list-header">
        <span>카테고리 이름</span>
        <span>전시여부</span>
        <span>삭제</span>
      </div>
      ${this.renderCategoryInputs()}</div>
      <div><button id="plus-category-input-button">+</button></div>
    </div>
    ${commonModalComponents.renderSubmitAndCancelButtons('category-registration')}`;
  },

  renderCategoryInputs() {
    return `<div class="category-registration-row">
      <span>
        <input class="category-name-input" type="text" />
      </span>
      <span>
        <select class="category-display-select">
          <option value="true">전시</option>
          <option value="false">숨기기</option>
        </select>
      </span>
      <span>
        <button class="category-delete-button">삭제</button>
      </span>
    </div>`;
  },
};

export default categoryModalComponents;
