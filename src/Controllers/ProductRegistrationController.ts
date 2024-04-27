import ModalController from '../core/modalController';
import $ from '../../utils/index.js';
import VALUES from '../../constants/values';
import validator from '../../utils/validator';
import productModalComponents from '../Views/modalComponents/productModalComponents';
import { ProductDataInterface } from '../interfaces/ModelInterfaces';
import { Product, Products } from '../interfaces/DataInterfaces';
import FormGenerator from '../../utils/FormGenerator';

class ProductRegistrationController extends ModalController {
  #productData;

  constructor(productData: ProductDataInterface) {
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
    ) as HTMLTableRowElement[];
    const inputs = rows
      .map((row) =>
        Array.from(row.querySelectorAll('input')).filter(
          (input) => input.className !== 'product-barcode-input',
        ),
      )
      .flat();
    if (inputs.every((input) => input.value !== '')) this.enableSubmitButton();
    else this.disableSubmitButton();
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
    ) as HTMLSelectElement[];
    this.#renderCategoriesSelectOptions(selects[selects.length - 1]);
  }

  #renderCategoriesSelectOptions(select: HTMLSelectElement) {
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
    $('#product-registration-container').addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('product-delete-button')) this.#deleteInputs(e);
    });
  }

  #deleteInputs(e: Event) {
    const target = e.target as HTMLButtonElement;
    const targetNode = target.closest('.product-registration-row') as HTMLTableRowElement;
    const parentNode = targetNode.parentNode as HTMLTableElement;
    if (parentNode.querySelectorAll('.product-registration-row').length === 1) return;
    parentNode.removeChild(targetNode);
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
    const dataToValidate: Products = { ...this.#productData.getProducts(), ...newProducts };
    if (!validator.validateProductRegistration(Object.values(dataToValidate))) return;
    this.#productData.registerProduct();
    this.#productData.updateNumberHistory('Product', Object.values(newProducts).length);
    this.hideModal();
  }

  #getNewProductsFromInput(): Products {
    const rows = ($('#product-registration-container') as HTMLTableElement).querySelectorAll(
      '.product-registration-row',
    ) as NodeListOf<HTMLTableRowElement>;
    const products: Products = {};
    const newestProductNumber = this.#productData.getNewestNumber('Product');
    rows.forEach((row, index) => {
      const product = this.#getInfoFromRow(row, index, newestProductNumber);
      products[newestProductNumber + index] = product;
    });
    return products;
  }

  #getInfoFromRow(row: HTMLTableRowElement, index: number, newestProductNumber: number): Product {
    const product = FormGenerator.generateProduct();
    this.#handleInputs(row, product);
    this.#handleSelects(row, product);
    product.number = newestProductNumber + index;
    return product;
  }

  #handleInputs(row: HTMLTableRowElement, product: Product) {
    const inputs = row.querySelectorAll('input');
    inputs.forEach((input, inputIndex) => {
      product[VALUES.inputKeys[inputIndex]] = input.value;
    });
  }
  #handleSelects(row: HTMLTableRowElement, product: Product) {
    const selects = Array.from(row.querySelectorAll('select'));
    const [category, display] = selects.map((select) => select.value);
    product.display = display === 'true';
    product.category = this.#productData.convertCategoryNameToNumber(category);
  }
}

export default ProductRegistrationController;
