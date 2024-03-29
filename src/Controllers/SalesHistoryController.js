import ModalController from '../core/modalController.js';
import $ from '../../utils/index.js';
import salesHistoryModalComponents from '../Views/modalComponents/salesHistoryModalComponents.js';
import validator from '../../utils/validator.js';

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
    this.#addSalesHistoryButtonEvent();
  }

  #addSalesHistoryButtonEvent() {
    $('#sales-history-button').addEventListener('click', () => {
      this.#renderSalesHistoryContainer();
    });
  }

  #renderDateSelect() {
    const dates = this.#salesData.getDateWithSales();
    flatpickr('#date-select', {
      defaultDate: dates[0],
      enable: dates,
      locale: 'ko',
    });
    $('#date-select').addEventListener('change', this.#renderSalesHistoryTable.bind(this));
  }

  #renderSalesHistoryContainer() {
    $('#modal-container').innerHTML = salesHistoryModalComponents.renderSalesHistoryContainer();
    this.#renderDateSelect();
    this.#renderSalesHistoryTable();
    this.showModal('wide');
    this.#addEvents();
  }

  #addEvents() {
    this.#addRefundEvent();
    this.addCloseButtonEvent();
    this.#addEditButtonEvent();
  }

  #renderSalesHistoryTable() {
    const dateText = $('#date-select').value;
    const salesHistory = this.#salesData.getSalesHistory(dateText);
    const products = Object.values(this.#productData.getProducts());
    this.#renderTbody(products, salesHistory);
    this.#renderTfoot(salesHistory);
  }

  #renderTbody(products, salesHistory) {
    const salesHistoryTable = $('#sales-history-table');
    salesHistoryTable.innerHTML = salesHistoryModalComponents.renderTable(products);
    salesHistoryTable.querySelector('tbody').innerHTML = salesHistory
      .map((eachSalesHistory) => salesHistoryModalComponents.renderTr(eachSalesHistory, products))
      .join('');
  }

  #renderTfoot(salesHistory) {
    const totalAmount = salesHistory.reduce((acc, sales) => acc + sales.chargeAmount, 0);
    const productsNumber = Object.keys(this.#productData.getProducts());
    const productSold = salesHistory.map((sales) => sales.products).flat();
    const productSoldObj = productSold.reduce((acc, product) => {
      acc[product.number] = (acc[product.number] || 0) + product.quantity;
      return acc;
    }, {});
    const productsQuantityArray = productsNumber.map((number) => productSoldObj[number] ?? 0);
    $('#sales-history-table').insertAdjacentHTML(
      'beforeend',
      salesHistoryModalComponents.renderTfoot(totalAmount, productsQuantityArray),
    );
  }

  #addRefundEvent() {
    $('#sales-history-table').addEventListener('click', (e) => {
      if (e.target.classList.contains('refund-button')) this.#refund(e);
    });
  }

  #refund(e) {
    if (!validator.validateRefund(e.target.closest('tr').dataset.refund)) return;
    const [date, salesNumber] = this.#getDateAndSalesNumber(e);
    this.#salesData.refund(date, salesNumber);
    this.#renderSalesHistoryTable();
  }

  #getDateAndSalesNumber(e) {
    const date = e.target.closest('tr').querySelector('.date').innerText;
    const salesNumber = Number(e.target.closest('tr').querySelector('.sales-number').innerText);
    return [date, salesNumber];
  }

  #addEditButtonEvent() {
    $('#sales-history-table').addEventListener('click', (e) => {
      if (!this.#editing && e.target.classList.contains('edit-button')) this.#handleEditButton(e);
      else if (this.#editing && e.target.classList.contains('submit-edit-button')) this.#handleSubmitButton(e);
    });
  }

  #handleEditButton(e) {
    salesHistoryModalComponents.replaceNoteSpanWithInput(e.target.closest('tr').querySelector('.note-span'));
    this.#editing = true;
    salesHistoryModalComponents.replaceEditButtonToSubmit(e);
  }

  #handleSubmitButton(e) {
    this.#editNote(e);
    salesHistoryModalComponents.replaceSubmitButtonToEdit(e);
    salesHistoryModalComponents.replaceNoteInputWithSpan(e.target.closest('tr').querySelector('.note-input'));
    this.#editing = false;
  }

  #editNote(e) {
    const [date, salesNumber] = this.#getDateAndSalesNumber(e);
    const editedNote = e.target.closest('tr').querySelector('.note-input').value;
    this.#salesData.editNote(date, salesNumber, editedNote);
  }
}

export default SalesHistoryController;
