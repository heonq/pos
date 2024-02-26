import ModalController from '../core/modalController.js';
import categoryModalComponents from '../Views/modalComponents/categoryModalComponents.js';
import $ from '../../utils/index.js';
import validator from '../../utils/validator.js';

class CategoryRegistrationController extends ModalController {
  #productData;

  constructor(productData) {
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
    this.addSubmitButtonEvent('category-registration-submit', this.#setNewCategoriesToStorage.bind(this));
    this.addCancelButtonEvent();
    this.#addUpdateSubmitButtonEvent();
  }

  #addUpdateSubmitButtonEvent() {
    $('#category-registration-list-container').addEventListener('input', this.#updateSubmitButton.bind(this));
  }

  #updateSubmitButton() {
    const rows = Array.from($('#category-registration-list-container').querySelectorAll('.category-registration-row'));
    if (rows.every((row) => row.querySelector('.category-name-input').value !== '')) return this.enableSubmitButton();
    return this.disableSubmitButton();
  }

  #addPlusCategoryInputRowEvent() {
    $('#plus-category-input-button').addEventListener('click', this.#plusCategoryInputRow.bind(this));
  }

  #plusCategoryInputRow() {
    $('#category-registration-list-container').insertAdjacentHTML(
      'beforeend',
      categoryModalComponents.renderCategoryInputs(),
    );
    this.#updateSubmitButton();
  }

  #addDeleteCategoryInputRow() {
    $('#category-registration-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('category-delete-button')) this.#deleteCategoryInputRow(e);
    });
  }

  #deleteCategoryInputRow(e) {
    const targetNode = e.target.closest('.category-registration-row');
    targetNode.parentNode.removeChild(targetNode);
  }

  #setNewCategoriesToStorage() {
    const newCategories = this.#getNewCategoriesFromInput();
    const dataToValidate = { ...this.#productData.getCategories(), ...newCategories };
    if (!validator.validateCategories(Object.values(dataToValidate))) return;
    this.#productData.registerCategory(newCategories);
    this.#productData.updateNumberHistory('Category', Object.values(newCategories).length);
    this.hideModal();
  }

  #getNewCategoriesFromInput() {
    const rows = $('#category-registration-list-container').querySelectorAll('.category-registration-row');
    const categories = {};
    const newestCategoryNumber = this.#productData.getNewestNumber('Category');
    rows.forEach((row, index) => {
      const category = {};
      category.name = row.querySelector('.category-name-input').value;
      category.display = row.querySelector('.category-display-select').value === 'true';
      category.number = newestCategoryNumber + index;
      categories[category.number] = category;
    });
    return categories;
  }
}

export default CategoryRegistrationController;
