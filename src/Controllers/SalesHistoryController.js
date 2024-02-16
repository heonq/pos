import ShoppingCartData from '../Models/ShoppingCartData.js';
import SalesData from '../Models/salesData.js';
import ModalController from '../core/ModalController.js';
import $ from '../../utils/index.js';
import modalComponents from '../Views/modalComponents.js';
import formatter from '../../utils/formatter.js';
import VALUES from '../../constants/values.js';

class SalesHistoryController extends ModalController {
  #shoppingCartData;

  #salesData;

  constructor() {
    super();
    this.#shoppingCartData = new ShoppingCartData();
    this.#salesData = new SalesData();
  }

  init() {
    this.addSalesHistoryButtonEvent();
  }

  addSalesHistoryButtonEvent() {
    $('#sales-history-button').addEventListener('click', () => {
      this.renderSalesHistory();
      this.showModal('wide');
    });
  }

  renderSalesHistory(dateText = formatter.formatDate(new Date())) {
    const salesHistory = this.#salesData.getSalesHistory(dateText);
    $('#modal-container').innerHTML = modalComponents.renderSalesHistory(salesHistory);
    this.addEditButtonEvent();
  }

  addEditButtonEvent() {
    $('#sales-history-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-button')) this.handleEdit(e);
    });
  }

  handleEdit(e) {
    e.target
      .closest('tr')
      .querySelectorAll('.editable')
      .forEach((span) => this.replaceSpanWithInput(span));
    this.replaceMethodSpanWithSelect(e.target.closest('tr').querySelector('.method'));
    e.target.className = 'edit-submit-button';
    e.target.innerText = '확인';
  }

  replaceSpanWithInput(span) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.innerText;
    span.parentNode.replaceChild(input, span);
  }

  replaceMethodSpanWithSelect(method) {
    const select = document.createElement('select');
    select.class = 'method';
    VALUES.paymentMethods.forEach((method) => {
      const option = document.createElement('option');
      option.value = method;
      option.text = method;
      select.appendChild(option);
    });
    method.parentNode.replaceChild(select, method);
  }
}

export default SalesHistoryController;
