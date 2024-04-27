import $ from '../../utils/index.js';
import categoryModalComponents from '../Views/modalComponents/categoryModalComponents';
import ModalController from '../core/modalController';
import validator from '../../utils/validator';
import { ProductDataInterface } from '../interfaces/ModelInterfaces';
import FormGenerator from '../../utils/FormGenerator';

class CategoryManagementController extends ModalController {
  #productData;

  constructor(productData: ProductDataInterface) {
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
    this.enableSubmitButton();
    this.#addHandleSelectedEvent();
    this.#addToggleTotalSelectsEvent();
    this.addRerenderClassName();
  }

  #addDeleteCategoryEvent() {
    $('#category-management-list-container')
      .querySelectorAll('.delete-category-button')
      .forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', (e) => {
          if (confirm('카테고리를 삭제하시겠습니까?')) {
            const targetElement = e.target as HTMLElement;
            const closestRow = targetElement.closest('.category-management-row') as HTMLElement;
            if (closestRow) this.#deleteCategory(closestRow);
          }
        });
      });
  }

  #deleteCategory(inputRow: HTMLElement) {
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
    rows.forEach((row: HTMLElement) => {
      const categoryNumber = Number(row.dataset.categoryNumber);
      const data = FormGenerator.generateCategory();
      const categoryNameInput = row.querySelector('.category-name-input') as HTMLInputElement;
      const displaySelect = row.querySelector('select') as HTMLSelectElement;
      if (categoryNameInput && displaySelect) {
        data.name = categoryNameInput.value;
        data.display = displaySelect.value === 'true';
        data.number = categoryNumber;
        this.#productData.updateCategory(categoryNumber, data);
      }
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

  #getSelectedRows(): HTMLTableRowElement[] {
    const totalRows = Array.from(
      $('#category-management-list-container').querySelectorAll('.category-management-row'),
    ) as HTMLTableRowElement[];
    const rows = totalRows.filter((row) => {
      const selectButton = row.querySelector('.category-select-button') as HTMLInputElement;
      if (selectButton) return selectButton.checked === true;
    });
    if (!validator.validateSelectedRows(rows.length)) return [];
    return rows;
  }

  #addHandleSelectedEvent() {
    $('#category-management-buttons').addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement;
      if (target.value === 'delete-selected-categories') this.#handleDeleteSelected();
      if (target.value === 'display-selected-categories') this.#controllSelectedDisplay(true);
      if (target.value === 'hide-selected-categories') this.#controllSelectedDisplay(false);
      target.value = 'default';
    });
  }

  #handleDeleteSelected() {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    if (confirm('선택한 카테고리를 모두 삭제하시겠습니까?')) {
      rows.forEach((row) => this.#deleteCategory(row));
      this.deselectTotal();
    }
  }

  #controllSelectedDisplay(boolean: boolean) {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    const boolText = boolean ? 'true' : 'false';
    if (confirm('선택한 카테고리의 전시상태를 수정하시겠습니까?')) {
      rows.forEach((row) => {
        const select = row.querySelector(`.category-display-${boolText}`) as HTMLOptionElement;
        select.selected = true;
      });
      this.deselectTotal();
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

  private deselectTotal() {
    $('#select-total-category-button').checked = false;
    this.#toggleTotalSelects();
  }
}

export default CategoryManagementController;
