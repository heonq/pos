import $ from '../utils/index.js';
import productDataModel from './Model/productDataModel.js';
import categoryMode from './Views/categoryMode.js';
import totalMode from './Views/totalMode.js';
import store from '../utils/store.js';

class HeaderController {
  init() {
    this.#hideComponentNotUsing();
    this.#addToggleViewMode();
    this.#addToggleViewModeMenu();
    this.#addToggleProductManagement();
    this.#addToggleModalContainer();
    this.#renderViewMode();
  }

  #hideComponentNotUsing() {
    $('body').addEventListener('click', (e) => {
      const targetId = e.target.id;
      this.#foldViewModeList(targetId);
      this.#foldProductManagementList(targetId);
      this.#hideModalContainer(targetId);
    });
  }

  #addToggleViewModeMenu() {
    $('#view-mode-button').addEventListener('click', () => {
      $('#view-container').classList.toggle('expanded');
    });
  }

  #addToggleViewMode() {
    $('#hidden-view-list').addEventListener('click', (e) => {
      this.#foldViewModeList();
      this.#toggleSelected(e);
      if (e.target.id === 'category-mode') return this.#renderCategoryMode();
      if (e.target.id === 'total-mode') return this.#renderTotalMode();
    });
  }

  #renderViewMode() {
    const viewMode = store.getStorage('view-mode');
    return viewMode === 'categoryMode' ? this.#renderCategoryMode() : this.#renderTotalMode();
  }

  #renderCategoryMode() {
    $('#view-mode-button').innerText = '카테고리별 보기';
    store.setStorage('view-mode', 'categoryMode');
    const categories = productDataModel.getCategoriesGotProduct();
    const productsArrays = productDataModel.getProducts();
    $('#product-container').innerHTML = categoryMode.renderCategoryModeComponent(
      categories,
      productsArrays,
    );
  }

  #renderTotalMode() {
    $('#view-mode-button').innerText = '전체 보기';
    store.setStorage('view-mode', 'totalMode');
    const productsArrays = productDataModel.getProducts();
    $('#product-container').innerHTML = totalMode.renderTotalModeComponent(productsArrays);
  }

  #toggleSelected(e) {
    const menus = document.querySelector('#hidden-view-list').querySelectorAll('div');
    menus.forEach((menu) => {
      e.target.id === menu.id ? menu.classList.add('selected') : menu.classList.remove('selected');
    });
  }

  #foldViewModeList(targetId) {
    const IDS = ['view-mode-button', 'category-mode', 'total-mode'];
    if (!IDS.includes(targetId)) {
      $('#view-container').classList.remove('expanded');
    }
  }

  #addToggleProductManagement() {
    $('#product-management-button').addEventListener('click', () => {
      $('#product-management-container').classList.toggle('expanded');
    });
  }

  #foldProductManagementList(targetId) {
    const IDS = [
      'product-management-button',
      'product-management',
      'product-registration',
      'category-management',
    ];
    if (!IDS.includes(targetId)) $('#product-management-container').classList.remove('expanded');
  }

  #addToggleModalContainer() {
    $('#button-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-button')) {
        $('#modal-container').classList.toggle('show');
        this.#showBackground();
      }
    });
  }

  #showBackground() {
    $('#background').classList.add('show');
  }

  #hideBackground() {
    $('#background').classList.remove('show');
  }

  #hideModalContainer(targetId) {
    if (targetId === 'background') {
      $('#modal-container').classList.remove('show');
      this.#hideBackground();
    }
  }
}

export default HeaderController;
