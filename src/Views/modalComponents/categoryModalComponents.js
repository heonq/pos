/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import commonModalComponents from './commonModalComponents.js';

const categoryModalComponents = {
  renderCategoryManagementModal() {
    return `<div id="category-management-container">
    <div><h3>카테고리 관리</h3></div>
          <div id="category-management-buttons-container">
            <select id="category-management-buttons">
            <option value="default" hidden>선택한 카테고리 수정</option>
              <option value="delete-selected-categories">선택한 카테고리 삭제</option>
              <option value="display-selected-categories">선택한 카테고리 전시</option>
              <option value="hide-selected-categories">선택한 카테고리 숨기기</option>
            </select>
          </div>
          <table id="category-management-table">
          <thead>
          <tr id="category-management-header">
            <th>
              <input id="select-total-category-button" type="checkbox" />
            </th>
            <th>카테고리 이름</th>
            <th>전시여부</th>
            <th>삭제</th>
          </tr>
          </thead>
          <tbody id="category-management-list-container"></tbody>
          </table>
        </div>${commonModalComponents.renderSubmitAndCancelButtons('category-management')}`;
  },
  renderCategoryRow(category) {
    return `<tr data-category-number=${category.number} class="category-management-row">
          <td><input type="checkbox" class="category-select-button" /></td>
          <td><input type="text" class="category-name-input" value=${category.name}></td>
          <td>
          <select>
          <option class="category-display-true" value="true" ${
            category.display === true ? 'selected' : ''
          }>전시</option>
          <option class="category-display-false" value="false" ${
            category.display === true ? '' : 'selected'
          }>숨기기</option>
          </select>
          </td>
          <td>
          <button class="delete-category-button">삭제</button>
          </td>
        </tr>`;
  },

  renderCategoryRegistrationModal() {
    return `<div id="category-registration-container">
    <div><h3>카테고리 등록</h3></div>
      <table id="category-registration-list-table">
      <thead>
      <tr id="category-registration-header">
        <th>카테고리 이름</th>
        <th>전시여부</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody id="category-registration-list-container">
      ${this.renderCategoryInputs()}</tbody></table>
      <div id="plus-category-input-button-container"><button id="plus-category-input-button">+</button></div>
    </div>
    ${commonModalComponents.renderSubmitAndCancelButtons('category-registration')}`;
  },

  renderCategoryInputs() {
    return `<tr class="category-registration-row">
      <td class="category-name-span">
        <input class="category-name-input" type="text" />
      </td>
      <td>
        <select class="category-display-select">
          <option value="true">전시</option>
          <option value="false">숨기기</option>
        </select>
      </td>
      <td>
        <button class="category-delete-button">삭제</button>
      </td>
    </tr>`;
  },
};

export default categoryModalComponents;
