/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import ModalController from '../core/modalController';
import $ from '../../utils/index.js';
import VALUES from '../../constants/values';
import validator from '../../utils/validator';
import productModalComponents from '../Views/modalComponents/productModalComponents';
import { ProductDataInterface } from '../interfaces/ModelInterfaces';
import { Product } from '../interfaces/DataInterfaces';
import FormGenerator from '../../utils/FormGenerator';

class ProductManagementController extends ModalController {
  #productData;

  constructor(productData: ProductDataInterface) {
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

  #renderCategoriesSelectOptions(select: HTMLSelectElement) {
    const categories = Object.values(this.#productData.getCategories()).map(
      (category) => category.name,
    );
    productModalComponents.renderOptions(select, categories);
  }

  #setChangedProductsToStorage() {
    this.#getChangedProductsFromInput();
    const dataToValidate = Object.values(this.#productData.getProducts());
    if (!validator.validateProductRegistration(dataToValidate)) return;
    this.#productData.registerProduct();
    this.hideModal();
  }

  #getChangedProductsFromInput() {
    const table = $('#product-management-container') as HTMLTableElement;
    const rows = table.querySelectorAll('.product-inputs-row') as NodeListOf<HTMLTableRowElement>;
    rows.forEach((row) => {
      this.#handleProductRow(row);
    });
  }

  #handleProductRow(row: HTMLTableRowElement) {
    const productNumber = Number(row.dataset.productNumber);
    const data = FormGenerator.generateProduct();
    this.#handleInputs(row, data);
    this.#handleSelects(row, data);
    this.#productData.updateProduct(productNumber, data);
  }

  #handleInputs(row: HTMLTableRowElement, data: Product) {
    const inputs = Array.from(row.querySelectorAll('input')).filter(
      (input) => input.type !== 'checkbox',
    );
    inputs.forEach((input, index) => {
      data[VALUES.inputKeys[index]] = input.value;
    });
  }

  #handleSelects(row: HTMLTableRowElement, data: Product) {
    const [category, display] = Array.from(row.querySelectorAll('select')).map(
      (select) => select.value,
    );
    data.category = this.#productData.convertCategoryNameToNumber(category);
    data.display = display === 'true';
  }

  #addRenderProductManagementModal() {
    $('#product-management').addEventListener('click', () => {
      this.#renderProductManagement();
      this.#initSelectCategoryModal();
      this.#renderCategoriesSelectOptions($('#search-by-category'));
    });
  }

  #renderProductManagement() {
    this.showModal('big');
    $('#modal-container').innerHTML = productModalComponents.renderProductManagementContainer();
    this.#renderSearchedProducts();
    this.#addEvents();
  }

  #addEvents() {
    this.#addHandleSelectedEvent();
    this.addSubmitButtonEvent(
      'product-management-submit',
      this.#setChangedProductsToStorage.bind(this),
    );
    this.addCancelButtonEvent();
    this.enableSubmitButton();
    this.addRerenderClassName();
    this.#addDeleteButtonEvent();
    this.#addSelectTotalEvent();
    $('#management-search-button').addEventListener(
      'click',
      this.#renderSearchedProducts.bind(this),
    );
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
    const [category, display] = [
      $('#search-by-category').value,
      VALUES.display[$('#search-by-display').value],
    ];
    const products = Object.values(this.#productData.getProducts());
    const productFilteredByCategory =
      category !== 'default'
        ? products.filter(
            (product) =>
              product.category === this.#productData.convertCategoryNameToNumber(category),
          )
        : products;
    const productFilteredByAllConditions =
      display !== 'default'
        ? productFilteredByCategory.filter((product) => product.display === display)
        : productFilteredByCategory;
    return productFilteredByAllConditions;
  }

  #addDeleteButtonEvent() {
    const buttons = $('#product-management-container').querySelectorAll(
      '.product-delete-button',
    ) as HTMLButtonElement[];
    buttons.forEach((button) => {
      button.addEventListener('click', (e: MouseEvent) => {
        if (confirm('상품을 삭제하시겠습니까?')) {
          const target = e.target as HTMLButtonElement;
          this.#deleteProduct(target.closest('.product-management-row') as HTMLTableRowElement);
        }
      });
    });
  }

  #deleteProduct(inputRow: HTMLTableRowElement) {
    const targetNumber = Number(inputRow.dataset.productNumber);
    const targetProduct = this.#productData.getProducts()[targetNumber];
    const salesQuantity = Number(targetProduct.salesQuantity);
    if (!validator.validateSalesQuantity(salesQuantity)) return;
    const childNode = inputRow;
    $('#product-list-container').removeChild(childNode);
    this.#productData.deleteProduct(targetNumber);
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
    $('#product-management-buttons').addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement;
      if (target.value === 'delete-selected') this.#handleDeleteSelected();
      if (target.value === 'display-selected') this.#controllSelectedDisplay(true);
      if (target.value === 'hide-selected') this.#controllSelectedDisplay(false);
      if (target.value === 'change-selected-category') this.#showSelectCategory();
      target.value = 'default';
    });
  }

  #getSelectedRows(): HTMLTableRowElement[] {
    const table = $('#product-list-container') as HTMLTableElement;
    const rows = Array.from(
      table.querySelectorAll('.product-management-row'),
    ) as HTMLTableRowElement[];
    const returnRows = rows.filter(
      (row) => (row.querySelector('.select-product-button') as HTMLInputElement).checked === true,
    );
    if (!validator.validateSelectedRows(rows.length)) return [];
    return returnRows;
  }

  #handleDeleteSelected() {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    if (confirm('선택한 상품을 모두 삭제하시겠습니까?')) {
      rows.forEach((row) => this.#deleteProduct(row));
      this.#deselectTotal();
    }
  }

  #controllSelectedDisplay(boolean: boolean) {
    const rows = this.#getSelectedRows();
    if (!rows.length) return;
    const boolText = boolean ? 'true' : 'false';
    if (confirm('선택한 상품의 전시상태를 수정하시겠습니까?')) {
      rows.forEach((row) => {
        (row.querySelector(`.product-display-${boolText}`) as HTMLOptionElement).selected = true;
      });
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
    selectedRows.forEach((row) => {
      (row.querySelector('.product-categories-select') as HTMLOptionElement).value = category;
    });
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
