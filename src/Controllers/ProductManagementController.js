/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import ModalController from '../core/modalController.js';
import $ from '../../utils/index.js';
import VALUES from '../../constants/values.js';
import validator from '../../utils/validator.js';
import productModalComponents from '../Views/modalComponents/productModalComponents.js';

class ProductManagementController extends ModalController {
  #productData;

  constructor(productData) {
    super();
    this.#productData = productData;
  }

  init() {
    this.#addRenderProductManagementModal();
  }

  #renderTotalSelectCategoriesOption() {
    const selects = $('.product-container').querySelectorAll('.product-categories-select');
    for (let i = 0; i < selects.length; i += 1) {
      this.#renderCategoriesSelectOptions(selects[i]);
      selects[i].value = this.#productData.convertCategoryNumberToName(selects[i].dataset.category);
    }
  }

  #renderCategoriesSelectOptions(select) {
    const categories = Object.values(this.#productData.getCategories()).map((category) => category.name);
    productModalComponents.renderOptions(select, categories);
  }

  #setChangedProductsToStorage() {
    this.#getChangedProductsFromInput();
    const dataToValidate = Object.values(this.#productData.getProducts());
    if (!validator.validateProductRegistration(dataToValidate)) return;
    this.#productData.registerProduct();
    this.#addRerenderProductClass();
    this.hideModal();
  }

  #getChangedProductsFromInput() {
    const rows = $('#product-management-container').querySelectorAll('.product-inputs-row');
    rows.forEach((row) => {
      const { productNumber } = row.dataset;
      const data = {};
      const inputs = Array.from(row.querySelectorAll('input')).filter((input) => input.type !== 'checkbox');
      const selects = row.querySelectorAll('select');
      inputs.forEach((input, index) => (data[VALUES.inputKeys[index]] = input.value));
      selects.forEach((select, index) => (data[VALUES.selectKeys[index]] = select.value));
      data.category = this.#productData.convertCategoryNameToNumber(data.category);
      data.display = data.display === 'true';
      this.#productData.updateProduct(productNumber, data);
    });
  }

  #addRenderProductManagementModal() {
    $('#product-management').addEventListener('click', () => {
      this.#productData.updateTotalProductsFromStorage();
      this.#renderProductManagement();
      this.#addDeleteButtonEventForManagement();
      this.#addSelectTotalEvent();
      this.#initSelectCategoryModal();
      this.#renderCategoriesSelectOptions($('#search-by-category'));
      $('#management-search-button').addEventListener('click', this.#renderSearchedProducts.bind(this));
    });
  }

  #renderProductManagement() {
    this.showModal('big');
    $('#modal-container').innerHTML = productModalComponents.renderProductManagementContainer();
    this.#renderSearchedProducts();
    this.#addHandleSelectedEvent();
    this.addSubmitButtonEvent('product-management-submit', this.#setChangedProductsToStorage.bind(this));
    this.addSubmitButtonEvent('product-management-cancel', this.hideModal.bind(this));
    this.enableSubmitButton('product-management-submit');
  }

  #renderSearchedProducts() {
    const productFilteredByAllConditions = this.#getFilteredProducts();
    const component = productFilteredByAllConditions
      .map((product) => productModalComponents.renderProductsInputs(product))
      .join('');
    $('#product-list-container').innerHTML = component;
    this.#renderTotalSelectCategoriesOption();
  }

  #getFilteredProducts() {
    const [category, display] = [$('#search-by-category').value, VALUES.display[$('#search-by-display').value]];
    const products = Object.values(this.#productData.getProducts());
    const productFilteredByCategory =
      category !== 'default' ? products.filter((product) => product.category === category) : products;
    const productFilteredByAllConditions =
      display !== 'default'
        ? productFilteredByCategory.filter((product) => product.display === display)
        : productFilteredByCategory;
    return productFilteredByAllConditions;
  }

  #addDeleteButtonEventForManagement() {
    $('#product-management-container')
      .querySelectorAll('.product-delete-button')
      .forEach((button) => {
        button.addEventListener('click', (e) => {
          if (confirm('상품을 삭제하시겠습니까?')) this.#deleteProduct(e.target.closest('.product-management-row'));
        });
      });
  }

  #deleteProduct(inputRow) {
    const targetNumber = inputRow.dataset.productNumber;
    if (!validator.validateSalesQuantity(this.#productData.getProducts()[targetNumber].salesQuantity)) return;
    const childNode = inputRow;
    $('#product-list-container').removeChild(childNode);
    this.#productData.deleteProduct(targetNumber);
    this.#addRerenderProductClass();
  }

  #addRerenderProductClass() {
    $('#product-management-submit').classList.add('rerender');
  }

  #addSelectTotalEvent() {
    $('.select-total-product-button').addEventListener('click', () => {
      this.#toggleTotalSelects();
    });
  }

  #toggleTotalSelects() {
    const { checked } = $('.select-total-product-button');
    const rows = $('#product-list-container').querySelectorAll('.product-management-row');
    for (let i = 0; i < rows.length; i += 1) {
      rows[i].querySelector('.select-product-button').checked = checked;
    }
  }

  #deselectTotal() {
    $('.select-total-product-button').checked = false;
    this.#toggleTotalSelects();
  }

  #addHandleSelectedEvent() {
    $('#product-management-buttons').addEventListener('change', (e) => {
      if (e.target.value === 'delete-selected') this.#handleDeleteSelected();
      if (e.target.value === 'display-selected') this.#controllSelectedDisplay(true);
      if (e.target.value === 'hide-selected') this.#controllSelectedDisplay(false);
      if (e.target.value === 'change-selected-category') this.#showSelectCategory();
      e.target.value = 'default';
    });
  }

  #getSelectedRows() {
    const rows = Array.from($('#product-list-container').querySelectorAll('.product-management-row')).filter(
      (row) => row.querySelector('.select-product-button').checked === true,
    );
    if (!validator.validateSelectedRows(rows.length)) return [];
    return rows;
  }

  #handleDeleteSelected() {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    if (confirm('선택한 상품을 모두 삭제하시겠습니까?')) {
      rows.forEach((row) => this.#deleteProduct(row));
      this.#deselectTotal();
    }
  }

  #controllSelectedDisplay(boolean) {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    const boolText = boolean ? 'true' : 'false';
    if (confirm('선택한 상품의 전시상태를 수정하시겠습니까?')) {
      for (let i = 0; i < rows.length; i += 1) {
        rows[i].querySelector(`.product-display-${boolText}`).selected = true;
      }
      this.#deselectTotal();
    }
  }

  #addSelectCategorySubmit() {
    this.addSubmitButtonEvent('selected-category-submit', () => {
      this.#submitCategory();
      this.#hideSelectCategory();
      this.#deselectTotal();
    });
    this.addSubmitButtonEvent('selected-category-cancel', this.#hideSelectCategory.bind(this));
  }

  #submitCategory() {
    const category = $('#category-select').value;
    const selectedRows = this.#getSelectedRows();
    for (let i = 0; i < selectedRows.length; i += 1) {
      selectedRows[i].querySelector('.product-categories-select').value = category;
    }
  }

  #showSelectCategory() {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    if (confirm('선택한 상품의 카테고리를 수정하시겠습니까?') && rows.length) {
      $('#category-modal').classList.add('show');
      $('#category-modal-background').classList.add('show');
    }
  }

  #hideSelectCategory() {
    $('#category-modal').classList.remove('show');
    $('#category-modal-background').classList.remove('show');
  }

  #initSelectCategoryModal() {
    this.#renderCategoriesSelectOptions($('#category-select'));
    this.#addSelectCategorySubmit();
  }
}

export default ProductManagementController;
