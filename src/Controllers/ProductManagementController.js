import ModalController from '../core/ModalController.js';
import ProductData from '../Models/productData.js';
import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import VALUES from '../../constants/values.js';
import validator from '../../utils/validator.js';

class ProductManagementController extends ModalController {
  #productData;

  constructor() {
    super();
    this.#productData = new ProductData();
  }

  init() {
    this.#addRenderProductManagementModal();
  }

  #renderTotalSelectCategoriesOption() {
    const selects = $('.product-container').querySelectorAll('.product-categories-select');
    selects.forEach((select) => {
      this.#renderCategoriesSelectOptions(select);
      select.value = select.dataset.category;
    });
  }

  #renderCategoriesSelectOptions(select) {
    const categories = this.#productData.getCategories().map((category) => category.name);
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
      data.display = data.display === 'true' ? true : false;
      this.#productData.updateProduct(productNumber, data);
    });
  }

  #addRenderProductManagementModal() {
    $('#product-management').addEventListener('click', () => {
      this.#productData.updateTotalProductsFromStorage();
      this.#renderProductManagement();
      this.#addDeleteButtonEventForManagement();
      this.addSubmitButtonEvent('product-management-submit', this.#setChangedProductsToStorage.bind(this));
      this.addSubmitButtonEvent('product-management-cancel', this.hideModal.bind(this));
      this.#addSelectTotalEvent();
    });
  }

  #renderProductManagement() {
    this.showModal('big');
    const products = Object.values(this.#productData.getProducts());
    const component = products.map((product) => modalComponents.renderProductsInputs(product)).join('');
    $('#modal-container').innerHTML = modalComponents.renderProductManagementContainer();
    $('#product-lists-container').insertAdjacentHTML('beforeend', component);
    this.#renderTotalSelectCategoriesOption();
    this.#addHandleSelectedEvent();
    this.enableSubmitButton();
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
    $('#product-lists-container').removeChild(childNode);
    this.#productData.deleteProduct(targetNumber);
    this.#addRerenderProductClass();
  }

  #addRerenderProductClass() {
    $('#submit').classList.add('rerender');
  }

  #addSelectTotalEvent() {
    $('.select-total-product-button').addEventListener('click', (e) => {
      this.#selectTotal(e);
    });
  }

  #selectTotal(e) {
    const checked = e.target.checked;
    const rows = $('#product-lists-container').querySelectorAll('.product-management-row');
    rows.forEach((row) => {
      row.querySelector('.select-product-button').checked = checked;
    });
  }

  #addHandleSelectedEvent() {
    $('#manage-selected-button').addEventListener('change', (e) => {
      if (e.target.value === 'delete-selected') {
        if (confirm('선택한 상품을 모두 삭제하시겠습니까?')) this.#deleteSelected();
      }
    });
  }

  #deleteSelected() {
    const targetRows = Array.from($('#product-lists-container').querySelectorAll('.product-management-row')).filter(
      (row) => row.querySelector('.select-product-button').checked === true,
    );
    targetRows.forEach((row) => this.#deleteProduct(row));
  }
}

export default ProductManagementController;
