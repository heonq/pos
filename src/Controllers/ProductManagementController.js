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
    this.#addRenderProductRegistraitonModal();
    this.#addRenderProductManagementModal();
  }

  #addRenderProductRegistraitonModal() {
    $('#product-registration').addEventListener('click', () => {
      this.showModal('big');
      $('#modal-container').innerHTML = modalComponents.renderProductRegistration();
      this.#renderLastSelectCategoriesOption();
      this.#addPlusButtonEvent();
      this.#addDeleteButtonEvent();
      this.addSubmitButtonEvent('product-registration-submit', this.#setProductsToStorage.bind(this));
      this.addSubmitButtonEvent('product-registration-cancel', this.hideModal.bind(this));
      this.#addInputPreventDefault();
    });
  }

  #addInputPreventDefault() {
    $('#product-registration-modal').addEventListener('keydown', (e) => {
      if (e.keyCode === 13) e.preventDefault();
    });
  }

  #renderLastSelectCategoriesOption() {
    const selects = Array.from($('.product-container').querySelectorAll('.product-categories-select'));
    this.#renderCategoriesSelectOptions(selects[selects.length - 1]);
  }

  #renderTotalSelectCategoriesOption() {
    const selects = $('.product-container').querySelectorAll('.product-categories-select');
    selects.forEach((select) => {
      this.#renderCategoriesSelectOptions(select);
      select.value = select.dataset.category;
    });
  }

  #renderCategoriesSelectOptions(select) {
    const categories = this.#productData.getTotalCategories().map((category) => category.name);
    modalComponents.renderOptions(select, categories);
  }

  #addPlusButtonEvent() {
    $('#plus-product-input-button').addEventListener('click', () => {
      this.#addProductInput();
    });
  }

  #addDeleteButtonEvent() {
    $('#product-registration-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('product-delete-button')) this.#deleteInputs(e);
    });
  }

  #deleteInputs(e) {
    const targetNode = e.target.closest('.product-inputs-row');
    targetNode.parentNode.removeChild(targetNode);
  }

  #addProductInput() {
    $('#product-registration-container').insertAdjacentHTML('beforeend', modalComponents.renderProductInputs());
    this.#renderLastSelectCategoriesOption();
  }

  #setProductsToStorage() {
    const dataToUpdate = { ...this.#productData.getTotalProducts(), ...this.#getProductsFromInput() };
    const dataToValidate = Object.values(dataToUpdate);
    if (!validator.validateNames(dataToValidate.map((product) => product.name))) return;
    if (!validator.validateBarcodes(dataToValidate)) return;
    if (!validator.validatePrice(dataToValidate)) return;
    this.#productData.registerProduct(dataToUpdate);
    this.hideModal();
  }

  #getProductsFromInput() {
    const rows = $('#product-registration-container').querySelectorAll('.product-inputs-row');
    const products = {};
    rows.forEach((row) => {
      const product = {};
      row.querySelectorAll('input').forEach((input, index) => (product[VALUES.inputKeys[index]] = input.value));
      row.querySelectorAll('select').forEach((select, index) => (product[VALUES.selectKeys[index]] = select.value));
      product.display === 'true' ? (product.display = true) : (product.display = false);
      product.salesQuantity = 0;
      products[product.name] = product;
    });
    return products;
  }

  #addRenderProductManagementModal() {
    $('#product-management').addEventListener('click', () => {
      this.showModal('big');
      this.#renderProductManagement();
    });
  }

  #renderProductManagement() {
    const products = Object.values(this.#productData.getTotalProducts());
    const component = products.map((product) => modalComponents.renderProductsInputs(product)).join('');
    $('#modal-container').innerHTML = modalComponents.renderProductManagementContainer();
    $('#product-lists-container').insertAdjacentHTML('beforeend', component);
    this.#renderTotalSelectCategoriesOption();
  }
}

export default ProductManagementController;
