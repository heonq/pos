import $ from '../../utils/index.js';
import store from '../../utils/store.js';
import ModalController from '../core/modalController.js';

class HeaderController extends ModalController {
  init() {
    this.#hideComponentNotUsing();
    this.#addToggleViewMode();
    this.#addToggleViewModeMenu();
    this.#addToggleProductManagement();
    this.#selectButton();
    this.#preventDefaultForm();
    this.#preventModalEnterKey();
  }

  #hideComponentNotUsing() {
    $('body').addEventListener('click', (e) => {
      const targetId = e.target.id;
      this.#foldViewModeList(targetId);
      this.#foldProductManagementList(targetId);
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
      if (e.target.id === 'category-mode') return this.#setButtonCategoryMode();
      return this.#setButtonTotalMode();
    });
  }

  #setButtonCategoryMode() {
    $('#view-mode-button').innerText = '카테고리별 보기';
    store.setStorage('view-mode', 'categoryMode');
    this.#selectCategoryButton();
  }

  #setButtonTotalMode() {
    $('#view-mode-button').innerText = '전체 보기';
    store.setStorage('view-mode', 'totalMode');
    this.#selectTotalButton();
  }

  #selectTotalButton() {
    const menus = document.querySelector('#hidden-view-list').querySelectorAll('div');
    menus.forEach((menu) => {
      if (menu.id === 'total-mode') return menu.classList.add('selected');
      return menu.classList.remove('selected');
    });
  }

  #selectCategoryButton() {
    const menus = document.querySelector('#hidden-view-list').querySelectorAll('div');
    menus.forEach((menu) => {
      if (menu.id === 'category-mode') return menu.classList.add('selected');
      return menu.classList.remove('selected');
    });
  }

  #selectButton() {
    const viewMode = store.getStorage('view-mode');
    if (viewMode === 'categoryMode') return this.#setButtonCategoryMode();
    return this.#setButtonTotalMode();
  }

  #foldViewModeList(targetId) {
    const IDS = ['view-mode-button', 'category-mode', 'total-mode'];
    if (!IDS.includes(targetId)) {
      $('#view-container').classList.remove('expanded');
    }
  }

  #addToggleProductManagement() {
    $('#product-management-button').addEventListener('click', () => {
      $('#product-management-button-container').classList.toggle('expanded');
    });
  }

  #foldProductManagementList(targetId) {
    if (targetId !== 'product-management-button')
      $('#product-management-button-container').classList.remove('expanded');
  }

  #preventDefaultForm() {
    document.querySelectorAll('form').forEach((form) =>
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      }),
    );
  }

  #preventModalEnterKey() {
    $('#modal-container').addEventListener('keydown', (e) => {
      if (e.keyCode === 13) e.preventDefault();
    });
  }
}

export default HeaderController;
