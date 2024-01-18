import $ from '../utils/index.js';
import categoryModeComponent from '../\bViews/categoryModeComponent.js';
import totalModeComponent from '../\bViews/totalModeComponent.js';

class HeaderController {
  init() {
    this.#hideComponentNotUsing();
    this.#addToggleViewMode();
    this.#addToggleViewModeMenu();
  }

  #hideComponentNotUsing() {
    $('body').addEventListener('click', (e) => {
      const targetId = e.target.id;
      this.#foldViewModeList(targetId);
    });
  }

  #addToggleViewModeMenu() {
    $('#view-mode-button').addEventListener('click', () => {
      $('#view-container').classList.toggle('expanded');
    });
  }

  #addToggleViewMode() {
    $('#hidden-view-list').addEventListener('click', (e) => {
      $('#view-mode-button').innerText = e.target.innerText;
      this.#foldViewModeList();
      this.#toggleSelected(e);
      if (e.target.id === 'category-mode') return this.#renderCategoryMode();
      if (e.target.id === 'total-mode') return this.#renderTotalMode();
    });
  }

  #renderCategoryMode() {
    $('#product-container').innerHTML = categoryModeComponent();
  }

  #renderTotalMode() {
    $('#product-container').innerHTML = totalModeComponent();
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
}

export default HeaderController;
