import ModalController from '../core/modalController.js';
import $ from '../../utils/index.js';
import VALUES from '../../constants/values';
import validator from '../../utils/validator';
import productModalComponents from '../Views/modalComponents/productModalComponents.js';

class ProductRegistrationController extends ModalController {
  #productData;

  constructor(productData) {
    super();
    this.#productData = productData;
  }

  init() {
    this.#addRenderProductRegistraitonModal();
  }

  #addRenderProductRegistraitonModal() {
    $('#product-registration').addEventListener('click', () => {
      this.#renderProductRegistraiton();
    });
  }

  #addUpdateSubmitButtonEvent() {
    $('#product-registration-container').addEventListener(
      'input',
      this.#updateSubmitButton.bind(this),
    );
  }

  #updateSubmitButton() {
    const rows = Array.from(
      $('#product-registration-container').querySelectorAll('.product-registration-row'),
    );
    const inputs = rows
      .map((row) =>
        Array.from(row.querySelectorAll('input')).filter(
          (input) => input.className !== 'product-barcode-input',
        ),
      )
      .flat();
    if (inputs.every((input) => input.value !== '')) return this.enableSubmitButton();
    return this.disableSubmitButton();
  }

  #renderProductRegistraiton() {
    this.showModal('big');
    $('#modal-container').innerHTML = productModalComponents.renderProductRegistration();
    this.#addProductInput();
    this.addRerenderClassName();
    this.#addEvents();
  }

  #addEvents() {
    this.#addPlusButtonEvent();
    this.#addDeleteButtonEventForRegistration();
    this.addSubmitButtonEvent(
      'product-registration-submit',
      this.#setNewProductsToStorage.bind(this),
    );
    this.addCancelButtonEvent();
    this.#addUpdateSubmitButtonEvent();
  }

  #renderLastSelectCategoriesOption() {
    const selects = Array.from(
      $('.product-container').querySelectorAll('.product-categories-select'),
    );
    this.#renderCategoriesSelectOptions(selects[selects.length - 1]);
  }

  #renderCategoriesSelectOptions(select) {
    const categories = Object.values(this.#productData.getCategories()).map(
      (category) => category.name,
    );
    productModalComponents.renderOptions(select, categories);
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
    const targetNode = e.target.closest('.product-registration-row');
    if (targetNode.parentNode.querySelectorAll('.product-registration-row').length === 1) return;
    targetNode.parentNode.removeChild(targetNode);
  }

  #addProductInput() {
    $('#product-registration-table-body').insertAdjacentHTML(
      'beforeend',
      productModalComponents.renderProductInputs(),
    );
    this.#renderLastSelectCategoriesOption();
  }

  #setNewProductsToStorage() {
    const newProducts = this.#getNewProductsFromInput();
    const dataToValidate = { ...this.#productData.getProducts(), ...newProducts };
    if (!validator.validateProductRegistration(Object.values(dataToValidate))) return;
    this.#productData.registerProduct(newProducts);
    this.#productData.updateNumberHistory('Product', Object.values(newProducts).length);
    this.hideModal();
  }

  #getNewProductsFromInput() {
    const rows = $('#product-registration-container').querySelectorAll('.product-registration-row');
    const products = {};
    const newestProductNumber = this.#productData.getNewestNumber('Product');
    rows.forEach((row, index) => {
      const product = this.#getInfoFromRow(row, index, newestProductNumber);
      products[product.number] = product;
    });
    return products;
  }

  #getInfoFromRow(row, index, newestProductNumber) {
    const product = {};
    row.querySelectorAll('input').forEach((input, inputIndex) => {
      product[VALUES.inputKeys[inputIndex]] = input.value;
    });
    row.querySelectorAll('select').forEach((select, inputIndex) => {
      product[VALUES.selectKeys[inputIndex]] = select.value;
    });
    product.number = newestProductNumber + index;
    product.display = product.display === 'true';
    product.category = this.#productData.convertCategoryNameToNumber(product.category);
    product.salesQuantity = 0;
    return product;
  }
}

export default ProductRegistrationController;
