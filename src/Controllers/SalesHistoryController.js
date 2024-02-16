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

  #editing;

  constructor() {
    super();
    this.#shoppingCartData = new ShoppingCartData();
    this.#salesData = new SalesData();
    this.#editing = false;
  }

  init() {
    this.addSalesHistoryButtonEvent();
  }

  addSalesHistoryButtonEvent() {
    $('#sales-history-button').addEventListener('click', () => {
      this.renderSalesHistoryContainer();
      this.renderSalesHistoryTable();
      this.showModal('wide');
    });
  }

  addSearchEvent() {
    $('#search-button').addEventListener('click', () => {
      this.renderSalesHistoryTable($('#date-select').value);
    });
  }

  renderDateSelect() {
    this.#salesData
      .getDateWithSales()
      .sort((a, b) => b.localeCompare(a))
      .forEach((date) => {
        const option = document.createElement('option');
        option.value = date;
        option.text = date;
        $('#date-select').appendChild(option);
      });
    this.addSearchEvent();
  }

  renderSalesHistoryContainer() {
    $('#modal-container').innerHTML = modalComponents.renderSalesHistoryContainer();
    this.addEditButtonEvent();
    this.renderDateSelect();
  }

  renderSalesHistoryTable(dateText = formatter.formatDate(new Date())) {
    const salesHistory = this.#salesData.getSalesHistory(dateText);
    $('#sales-history-container').innerHTML = modalComponents.renderTable(salesHistory);
    this.#editing = false;
  }

  addEditButtonEvent() {
    $('#sales-history-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-button')) this.handleEdit(e);
    });
  }

  handleEdit(e) {
    if (this.#editing) return;
    this.#editing = true;
    e.target
      .closest('tr')
      .querySelectorAll('.editable')
      .forEach((span) => modalComponents.replaceSpanWithInput(span));
    modalComponents.replaceMethodSpanWithSelect(e.target.closest('tr').querySelector('.method'));
    e.target.className = 'edit-submit-button';
    e.target.innerText = '확인';
  }
}

export default SalesHistoryController;