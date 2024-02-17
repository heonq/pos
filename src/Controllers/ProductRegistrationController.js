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
      this.showModal('big');
      $('#modal-container').innerHTML = modalComponents.renderProductRegistration();
      this.#renderCategoriesSelectOptions();
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

  #renderCategoriesSelectOptions() {
    const categories = this.#productData.getTotalCategories().map((category) => category.name);
    const selects = Array.from($('#product-registration-container').querySelectorAll('.product-categories-select'));
    modalComponents.renderOptions(selects[selects.length - 1], categories);
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
    this.#renderCategoriesSelectOptions();
  }

  #setProductsToStorage() {
    const dataToUpdate = [...this.#productData.getTotalProducts(), ...this.#getProductsFromInput()];
    if (!validator.validateNames(dataToUpdate.map((product) => product.name))) return;
    if (!validator.validateBarcodes(dataToUpdate)) return;
    if (!validator.validatePrice(dataToUpdate)) return;
    this.#productData.registerProduct(dataToUpdate);
    this.hideModal();
  }

  #getProductsFromInput() {
    const rows = Array.from($('#product-registration-container').querySelectorAll('.product-inputs-row'));
    const products = [];
    rows.forEach((row) => {
      const product = {};
      Array.from(row.querySelectorAll('input')).forEach(
        (input, index) => (product[VALUES.inputKeys[index]] = input.value),
      );
      Array.from(row.querySelectorAll('select')).forEach(
        (select, index) => (product[VALUES.selectKeys[index]] = select.value),
      );
      product.display === 'true' ? (product.display = true) : (product.display = false);
      products.push(product);
    });
    return products;
  }
}

export default ProductRegistrationController;
