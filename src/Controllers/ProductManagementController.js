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
      this.#renderProductRegistraiton();
      this.#addPlusButtonEvent();
      this.#addDeleteButtonEventForRegistration();
      this.addSubmitButtonEvent('product-registration-submit', this.#setProductsToStorage.bind(this));
      this.addSubmitButtonEvent('product-registration-cancel', this.hideModal.bind(this));
    });
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

  #setProductsToStorage() {
    const dataToUpdate = { ...this.#productData.getTotalProducts(), ...this.#getProductsFromInput() };
    const dataToValidate = Object.values(dataToUpdate);
    if (!validator.validateNames(dataToValidate.map((product) => product.name))) return;
    if (!validator.validateBarcodes(dataToValidate)) return;
    if (!validator.validatePrice(dataToValidate)) return;
    this.#productData.registerProduct(dataToUpdate);
    this.#addRerenderProductClass();
    this.hideModal();
  }

  #getProductsFromInput() {
    const rows = $('#product-registration-container').querySelectorAll('.product-inputs-row');
    const products = {};
    const newestProductNumber = this.#productData.getNewestProductNumber();
    rows.forEach((row, index) => {
      const product = {};
      row.querySelectorAll('input').forEach((input, index) => (product[VALUES.inputKeys[index]] = input.value));
      row.querySelectorAll('select').forEach((select, index) => (product[VALUES.selectKeys[index]] = select.value));
      product.number = newestProductNumber + index;
      product.display === 'true' ? (product.display = true) : (product.display = false);
      product.salesQuantity = 0;
      products[product.number] = product;
    });
    return products;
  }

  #addRenderProductManagementModal() {
    $('#product-management').addEventListener('click', () => {
      this.showModal('big');
      this.#renderProductManagement();
      this.#addDeleteButtonEventForManagement();
    });
  }

  #renderProductManagement() {
    const products = Object.values(this.#productData.getTotalProducts());
    const component = products.map((product) => modalComponents.renderProductsInputs(product)).join('');
    $('#modal-container').innerHTML = modalComponents.renderProductManagementContainer();
    $('#product-lists-container').insertAdjacentHTML('beforeend', component);
    this.#renderTotalSelectCategoriesOption();
  }

  #addDeleteButtonEventForManagement() {
    $('#product-management-container')
      .querySelectorAll('.product-delete-button')
      .forEach((button) => {
        button.addEventListener('click', (e) => {
          if (confirm('상품을 삭제하시겠습니까?')) this.#deleteProduct(e);
        });
      });
  }

  #deleteProduct(e) {
    const targetNumber = e.target.closest('.product-management-row').dataset.productNumber;
    const products = this.#productData.getTotalProducts();
    if (!validator.validateSalesQuantity(products[targetNumber].salesQuantity)) return;
    delete products[targetNumber];
    this.#productData.registerProduct(products);
    const childNode = e.target.closest('.product-management-row');
    $('#product-lists-container').removeChild(childNode);
    this.#addRerenderProductClass();
  }

  #addRerenderProductClass() {
    $('#submit').classList.add('rerender');
  }
}

export default ProductManagementController;
