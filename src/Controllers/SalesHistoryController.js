import ModalController from '../core/modalController.js';
import $ from '../../utils/index.js';
import formatter from '../../utils/formatter.js';
import salesHistoryModalComponents from '../Views/modalComponents/salesHistoryModalComponents.js';

class SalesHistoryController extends ModalController {
  #productData;

  #salesData;

  #editing;

  constructor(productData, salesData) {
    super();
    this.#productData = productData;
    this.#salesData = salesData;
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
    $('#modal-container').innerHTML = salesHistoryModalComponents.renderSalesHistoryContainer();
    this.addEditButtonEvent();
    this.renderDateSelect();
  }

  renderSalesHistoryTable(dateText = formatter.formatDate(new Date())) {
    const salesHistory = this.#salesData.getSalesHistory(dateText);
    const products = Object.values(this.#productData.getProducts());
    $('#sales-history-container').innerHTML = salesHistoryModalComponents.renderTable(salesHistory, products);
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
      .forEach((span) => salesHistoryModalComponents.replaceSpanWithInput(span));
    salesHistoryModalComponents.replaceMethodSpanWithSelect(e.target.closest('tr').querySelector('.method'));
    e.target.className = 'edit-submit-button';
    e.target.innerText = '확인';
  }
}

export default SalesHistoryController;
