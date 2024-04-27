import ModalController from '../core/modalController';
import categoryModalComponents from '../Views/modalComponents/categoryModalComponents';
import $ from '../../utils/index.js';
import validator from '../../utils/validator';
import { Categories } from '../interfaces/DataInterfaces';
import FormGenerator from '../../utils/FormGenerator';
import { ProductDataInterface } from '../interfaces/ModelInterfaces';

class CategoryRegistrationController extends ModalController {
  #productData;

  constructor(productData: ProductDataInterface) {
    super();
    this.#productData = productData;
  }

  init() {
    this.#addRenderCategoryRegistrationModalEvent();
  }

  #addRenderCategoryRegistrationModalEvent() {
    $('#category-registration').addEventListener('click', () => {
      this.#renderCategoryRegistrationModal();
    });
  }

  #renderCategoryRegistrationModal() {
    $('#modal-container').innerHTML = categoryModalComponents.renderCategoryRegistrationModal();
    this.showModal('small');
    this.#addPlusCategoryInputRowEvent();
    this.#addDeleteCategoryInputRow();
    this.addSubmitButtonEvent(
      'category-registration-submit',
      this.#setNewCategoriesToStorage.bind(this),
    );
    this.addCancelButtonEvent();
    this.#addUpdateSubmitButtonEvent();
  }

  #addUpdateSubmitButtonEvent() {
    $('#category-registration-list-table').addEventListener(
      'input',
      this.#updateSubmitButton.bind(this),
    );
  }

  #updateSubmitButton() {
    const rows = Array.from(
      $('#category-registration-list-container').querySelectorAll('.category-registration-row'),
    ) as HTMLTableRowElement[];
    if (
      rows.every((row) => {
        const nameInput = row.querySelector('.category-name-input') as HTMLInputElement;
        return nameInput.value !== '';
      })
    )
      return this.enableSubmitButton();
    return this.disableSubmitButton();
  }

  #addPlusCategoryInputRowEvent() {
    $('#plus-category-input-button').addEventListener(
      'click',
      this.#plusCategoryInputRow.bind(this),
    );
  }

  #plusCategoryInputRow() {
    $('#category-registration-list-container').insertAdjacentHTML(
      'beforeend',
      categoryModalComponents.renderCategoryInputs(),
    );
    this.#updateSubmitButton();
  }

  #addDeleteCategoryInputRow() {
    $('#category-registration-container').addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('category-delete-button')) this.#deleteCategoryInputRow(e);
    });
  }

  #deleteCategoryInputRow(e: Event) {
    const target = e.target as HTMLElement;
    const targetNode = target.closest('.category-registration-row') as HTMLElement;
    const parentNode = targetNode.parentNode as HTMLElement;
    parentNode.removeChild(targetNode);
  }

  #setNewCategoriesToStorage() {
    const newCategories = this.#getNewCategoriesFromInput();
    const dataToValidate = { ...this.#productData.getCategories(), ...newCategories };
    if (!validator.validateCategories(Object.values(dataToValidate))) return;
    this.#productData.registerCategory();
    this.#productData.updateNumberHistory('Category', Object.values(newCategories).length);
    this.hideModal();
  }

  #getNewCategoriesFromInput(): Categories {
    const rows = $('#category-registration-list-table').querySelectorAll(
      '.category-registration-row',
    ) as HTMLTableRowElement[];
    const categories: Categories = {};
    const newestCategoryNumber = this.#productData.getNewestNumber('Category');
    rows.forEach((row, index) => {
      const category = FormGenerator.generateCategory();
      category.name = (row.querySelector('.category-name-input') as HTMLInputElement).value;
      const displaySelect = row.querySelector('.category-display-select') as HTMLSelectElement;
      const displayBoolean = displaySelect.value === 'true';
      category.display = displayBoolean;
      category.number = newestCategoryNumber + index;
      categories[category.number] = category;
    });
    return categories;
  }
}

export default CategoryRegistrationController;
