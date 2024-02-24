import $ from '../../utils/index.js';
import ProductData from '../Models/productData.js';
import modalComponents from '../Views/modalComponents.js';
import ModalController from '../core/ModalController.js';
import validator from '../../utils/validator.js';

class CategoryManagementController extends ModalController {
  #productData;

  constructor() {
    super();
    this.#productData = new ProductData();
  }

  init() {
    this.#addRenderModalEvent();
  }

  #addRenderModalEvent() {
    $('#category-management').addEventListener('click', this.#renderCategoryManagementModal.bind(this));
  }

  #renderCategoryManagementModal() {
    this.#productData.updateTotalCategoriesFromStorage();
    const categories = Object.values(this.#productData.getCategories());
    $('#modal-container').innerHTML = modalComponents.renderCategoryManagementModal();
    $('#category-list-container').innerHTML = categories
      .map((category) => modalComponents.renderCategoryRow(category))
      .join('');
    this.showModal('small');
    this.#addDeleteCategoryEvent();
    this.addSubmitButtonEvent('category-management-submit', this.#setChangedCategoriesToStorage.bind(this));
    this.addSubmitButtonEvent('category-management-cancel', this.hideModal.bind(this));
    this.enableSubmitButton('category-management-submit');
    this.#addToggleTotalSelectsEvent();
    this.#addHandleSelectedEvent();
  }

  #addDeleteCategoryEvent() {
    $('#category-list-container')
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
    if (!validator.validateCategoryDelete(targetNumber, Object.values(this.#productData.getProducts()))) return;
    $('#category-list-container').removeChild(childNode);
    this.#productData.deleteCategory(targetNumber);
  }

  #getChangedCategoriesFromInputs() {
    const rows = $('#category-list-container').querySelectorAll('.category-management-row');
    rows.forEach((row) => {
      const categoryNumber = row.dataset.categoryNumber;
      const data = {};
      const categoryName = row.querySelector('.category-name-input').value;
      const display = row.querySelector('select').value;
      data.name = categoryName;
      data.display = display === 'true' ? true : false;
      data.number = categoryNumber;
      this.#productData.updateCategory(categoryNumber, data);
    });
  }

  #setChangedCategoriesToStorage() {
    this.#getChangedCategoriesFromInputs();
    const dataToValidate = Object.values(this.#productData.getCategories());
    if (!validator.validateCategories(dataToValidate)) return;
    this.#productData.registerCategory();
    $('#category-management-submit').classList.add('rerender');
    this.hideModal();
  }

  #addToggleTotalSelectsEvent() {
    $('#select-total-category-button').addEventListener('click', this.#toggleTotalSelects.bind(this));
  }

  #getSelectedRows() {
    const rows = Array.from($('#category-list-container').querySelectorAll('.category-management-row')).filter(
      (row) => row.querySelector('.category-select-button').checked === true,
    );
    if (!validator.validateSelectedRows(rows.length)) return [];
    return rows;
  }

  #addHandleSelectedEvent() {
    $('#category-management-buttons').addEventListener('change', (e) => {
      const rows = this.#getSelectedRows();
      if (rows.length && e.target.value === 'delete-selected-categories') {
        if (confirm('선택한 카테고리를 모두 삭제하시겠습니까?')) {
          rows.forEach((row) => this.#deleteCategory(row));
          this.#deselectTotal();
        }
      }
      if (rows.length && e.target.value === 'display-selected-categories') {
        if (confirm('선택한 카테고리를 모두 전시하시겠습니까?')) this.#controllSelectedDisplay(rows, true);
      }
      if (rows.length && e.target.value === 'hide-selected-categories') {
        if (confirm('선택된 카테고리를 모두 숨기시겠습니까?')) this.#controllSelectedDisplay(rows, false);
      }
      e.target.value = 'default';
    });
  }

  #controllSelectedDisplay(rows, boolean) {
    rows.forEach((row) => (row.querySelector(`.category-display-${boolean ? 'true' : 'false'}`).selected = true));
    this.#deselectTotal();
  }

  #toggleTotalSelects() {
    const checked = $('#select-total-category-button').checked;
    const rows = $('#category-list-container').querySelectorAll('.category-management-row');
    rows.forEach((row) => {
      row.querySelector('.category-select-button').checked = checked;
    });
  }

  #deselectTotal() {
    $('#select-total-category-button').checked = false;
    this.#toggleTotalSelects();
  }
}

export default CategoryManagementController;
