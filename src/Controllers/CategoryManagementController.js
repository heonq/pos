import $ from '../../utils/index.js';
import categoryModalComponents from '../Views/modalComponents/categoryModalComponents.js';
import ModalController from '../core/modalController.js';
import validator from '../../utils/validator';

class CategoryManagementController extends ModalController {
  #productData;

  constructor(productData) {
    super();
    this.#productData = productData;
  }

  init() {
    this.#addRenderModalEvent();
  }

  #addRenderModalEvent() {
    $('#category-management').addEventListener(
      'click',
      this.#renderCategoryManagementModal.bind(this),
    );
  }

  #renderCategoryManagementModal() {
    const categories = Object.values(this.#productData.getCategories());
    $('#modal-container').innerHTML = categoryModalComponents.renderCategoryManagementModal();
    $('#category-management-list-container').innerHTML = categories
      .map((category) => categoryModalComponents.renderCategoryRow(category))
      .join('');
    this.showModal('small');
    this.#addEvents();
  }

  #addEvents() {
    this.#addDeleteCategoryEvent();
    this.addSubmitButtonEvent(
      'category-management-submit',
      this.#setChangedCategoriesToStorage.bind(this),
    );
    this.addCancelButtonEvent();
    this.enableSubmitButton('category-management-submit');
    this.#addHandleSelectedEvent();
    this.#addToggleTotalSelectsEvent();
    this.addRerenderClassName();
  }

  #addDeleteCategoryEvent() {
    $('#category-management-list-container')
      .querySelectorAll('.delete-category-button')
      .forEach((button) => {
        button.addEventListener('click', (e) => {
          if (confirm('카테고리를 삭제하시겠습니까?'))
            this.#deleteCategory(e.target.closest('.category-management-row'));
        });
      });
  }

  #deleteCategory(inputRow) {
    const targetNumber = Number(inputRow.dataset.categoryNumber);
    const childNode = inputRow;
    if (
      !validator.validateCategoryDelete(
        targetNumber,
        Object.values(this.#productData.getProducts()),
      )
    )
      return;
    $('#category-management-list-container').removeChild(childNode);
    this.#productData.deleteCategory(targetNumber);
  }

  #getChangedCategoriesFromInputs() {
    const rows = $('#category-management-list-container').querySelectorAll(
      '.category-management-row',
    );
    rows.forEach((row) => {
      const { categoryNumber } = row.dataset;
      const data = {};
      const categoryName = row.querySelector('.category-name-input').value;
      const display = row.querySelector('select').value;
      data.name = categoryName;
      data.display = display === 'true';
      data.number = categoryNumber;
      this.#productData.updateCategory(categoryNumber, data);
    });
  }

  #setChangedCategoriesToStorage() {
    this.#getChangedCategoriesFromInputs();
    const dataToValidate = Object.values(this.#productData.getCategories());
    if (!validator.validateCategories(dataToValidate)) return;
    this.#productData.registerCategory();
    this.hideModal();
  }

  #addToggleTotalSelectsEvent() {
    $('#select-total-category-button').addEventListener(
      'click',
      this.#toggleTotalSelects.bind(this),
    );
  }

  #getSelectedRows() {
    const rows = Array.from(
      $('#category-management-list-container').querySelectorAll('.category-management-row'),
    ).filter((row) => row.querySelector('.category-select-button').checked === true);
    if (!validator.validateSelectedRows(rows.length)) return [];
    return rows;
  }

  #addHandleSelectedEvent() {
    $('#category-management-buttons').addEventListener('change', (e) => {
      if (e.target.value === 'delete-selected-categories') this.#handleDeleteSelected();
      if (e.target.value === 'display-selected-categories') this.#controllSelectedDisplay(true);
      if (e.target.value === 'hide-selected-categories') this.#controllSelectedDisplay(false);
      e.target.value = 'default';
    });
  }

  #handleDeleteSelected() {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    if (confirm('선택한 카테고리를 모두 삭제하시겠습니까?')) {
      rows.forEach((row) => this.#deleteCategory(row));
      this.#deselectTotal();
    }
  }

  #controllSelectedDisplay(boolean) {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    const boolText = boolean ? 'true' : 'false';
    if (confirm('선택한 카테고리의 전시상태를 수정하시겠습니까?')) {
      for (let i = 0; i < rows.length; i += 1) {
        rows[i].querySelector(`.category-display-${boolText}`).selected = true;
      }
      this.#deselectTotal();
    }
  }

  #toggleTotalSelects() {
    const { checked } = $('#select-total-category-button');
    const rows = $('#category-management-list-container').querySelectorAll(
      '.category-management-row',
    );
    for (let i = 0; i < rows.length; i += 1) {
      rows[i].querySelector('.category-select-button').checked = checked;
    }
  }

  #deselectTotal() {
    $('#select-total-category-button').checked = false;
    this.#toggleTotalSelects();
  }
}

export default CategoryManagementController;
