import ModalController from '../core/modalController.js';
import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import VALUES from '../../constants/values.js';
import validator from '../../utils/validator.js';

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
    selects.forEach((select) => {
      this.#renderCategoriesSelectOptions(select);
      select.value = this.#productData.convertCategoryNumberToName(select.dataset.category);
    });
  }

  #renderCategoriesSelectOptions(select) {
    const categories = Object.values(this.#productData.getCategories()).map((category) => category.name);
    modalComponents.renderOptions(select, categories);
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
      const productNumber = row.dataset.productNumber;
      const data = {};
      const inputs = Array.from(row.querySelectorAll('input')).filter((input) => input.type !== 'checkbox');
      const selects = row.querySelectorAll('select');
      inputs.forEach((input, index) => (data[VALUES.inputKeys[index]] = input.value));
      selects.forEach((select, index) => (data[VALUES.selectKeys[index]] = select.value));
      data.category = this.#productData.convertCategoryNameToNumber(data.category);
      data.display = data.display === 'true' ? true : false;
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
    $('#modal-container').innerHTML = modalComponents.renderProductManagementContainer();
    this.#renderSearchedProducts();
    this.#addHandleSelectedEvent();
    this.addSubmitButtonEvent('product-management-submit', this.#setChangedProductsToStorage.bind(this));
    this.addSubmitButtonEvent('product-management-cancel', this.hideModal.bind(this));
    this.enableSubmitButton('product-management-submit');
  }

  #renderSearchedProducts() {
    const productFilteredByAllConditions = this.#getFilteredProducts();
    const component = productFilteredByAllConditions
      .map((product) => modalComponents.renderProductsInputs(product))
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
    const checked = $('.select-total-product-button').checked;
    const rows = $('#product-list-container').querySelectorAll('.product-management-row');
    rows.forEach((row) => {
      row.querySelector('.select-product-button').checked = checked;
    });
  }

  #deselectTotal() {
    $('.select-total-product-button').checked = false;
    this.#toggleTotalSelects();
  }

  #addHandleSelectedEvent() {
    $('#product-management-buttons').addEventListener('change', (e) => {
      const rows = this.#getSelectedRows();
      if (rows && e.target.value === 'delete-selected') {
        if (confirm('선택한 상품을 모두 삭제하시겠습니까?')) {
          rows.forEach((row) => this.#deleteProduct(row));
          this.#deselectTotal();
        }
      }
      if (rows && e.target.value === 'display-selected') {
        if (confirm('선택한 상품을 모두 전시하시겠습니까?')) this.#controllSelectedDisplay(rows, true);
      }
      if (rows && e.target.value === 'hide-selected') {
        if (confirm('선택된 상품을 모두 숨기시겠습니까?')) this.#controllSelectedDisplay(rows, false);
      }
      if (rows && e.target.value === 'change-selected-category') {
        if (confirm('선택된 상품의 카테고리를 변경하시겠습니까?')) this.#showSelectCategory();
      }
      e.target.value = 'default';
    });
  }

  #getSelectedRows() {
    const rows = Array.from($('#product-list-container').querySelectorAll('.product-management-row')).filter(
      (row) => row.querySelector('.select-product-button').checked === true,
    );
    if (!validator.validateSelectedRows(rows.length)) return false;
    return rows;
  }

  #controllSelectedDisplay(rows, boolean) {
    rows.forEach((row) => (row.querySelector(`.product-display-${boolean ? 'true' : 'false'}`).selected = true));
    this.#deselectTotal();
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
    selectedRows.forEach((row) => (row.querySelector('.product-categories-select').value = category));
  }

  #showSelectCategory() {
    $('#category-modal').classList.add('show');
    $('#category-modal-background').classList.add('show');
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
