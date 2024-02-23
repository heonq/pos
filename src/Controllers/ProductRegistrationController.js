import ModalController from '../core/ModalController.js';
import ProductData from '../Models/productData.js';
import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import VALUES from '../../constants/values.js';
import validator from '../../utils/validator.js';

class ProductRegistrationController extends ModalController {
  #productData;

  constructor() {
    super();
    this.#productData = new ProductData();
  }

  init() {
    this.#addRenderProductRegistraitonModal();
  }

  #addRenderProductRegistraitonModal() {
    $('#product-registration').addEventListener('click', () => {
      this.#productData.updateTotalProductsFromStorage();
      this.#renderProductRegistraiton();
      this.#addPlusButtonEvent();
      this.#addDeleteButtonEventForRegistration();
      this.addSubmitButtonEvent('product-registration-submit', this.#setNewProductsToStorage.bind(this));
      this.addSubmitButtonEvent('product-registration-cancel', this.hideModal.bind(this));
      this.#addUpdateSubmitButtonEvent();
    });
  }

  #addUpdateSubmitButtonEvent() {
    $('#product-registration-modal').addEventListener('input', this.#updateSubmitButton.bind(this));
  }

  #updateSubmitButton() {
    const rows = Array.from($('#product-registration-container').querySelectorAll('.product-inputs-row'));
    const inputs = rows
      .map((row) =>
        Array.from(row.querySelectorAll('input')).filter((input) => input.className !== 'product-barcode-input'),
      )
      .flat();
    if (inputs.every((input) => input.value !== '')) return this.enableSubmitButton('product-registration-submit');
    return this.disableSubmitButton('product-registration-submit');
  }

  #renderProductRegistraiton() {
    this.showModal('big');
    $('#modal-container').innerHTML = modalComponents.renderProductRegistration();
    this.#addProductInput();
  }

  #renderLastSelectCategoriesOption() {
    const selects = Array.from($('.product-container').querySelectorAll('.product-categories-select'));
    this.#renderCategoriesSelectOptions(selects[selects.length - 1]);
  }

  #renderCategoriesSelectOptions(select) {
    const categories = this.#productData.getCategories().map((category) => category.name);
    modalComponents.renderOptions(select, categories);
  }

  #addPlusButtonEvent() {
    $('#plus-product-input-button').addEventListener('click', () => {
      this.#addProductInput();
    });
  }

  #addDeleteButtonEventForRegistration() {
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

  #setNewProductsToStorage() {
    const newProducts = this.#getNewProductsFromInput();
    const dataToValidate = { ...this.#productData.getProducts(), ...newProducts };
    if (!validator.validateProductRegistration(Object.values(dataToValidate))) return;
    this.#productData.registerProduct(newProducts);
    this.#productData.updateProductNumberHistory(Object.values(newProducts).length);
    this.#addRerenderProductClass();
    this.hideModal();
  }

  #getNewProductsFromInput() {
    const rows = $('#product-registration-container').querySelectorAll('.product-inputs-row');
    const products = {};
    const newestProductNumber = this.#productData.getNewestProductNumber();
    rows.forEach((row, index) => {
      const product = {};
      row.querySelectorAll('input').forEach((input, index) => (product[VALUES.inputKeys[index]] = input.value));
      row.querySelectorAll('select').forEach((select, index) => (product[VALUES.selectKeys[index]] = select.value));
      product.number = newestProductNumber + index;
      product.display = product.display === 'true' ? true : false;
      product.salesQuantity = 0;
      products[product.number] = product;
    });
    return products;
  }

  #addRerenderProductClass() {
    $('#product-registration-submit').classList.add('rerender');
  }
}

export default ProductRegistrationController;
