import ModalController from '../core/modalController';
import $ from '../../utils/index.js';
import salesHistoryModalComponents from '../Views/modalComponents/salesHistoryModalComponents';
import validator from '../../utils/validator';
import { ProductDataInterface, SalesDataInterface } from '../interfaces/ModelInterfaces';
import { Product, ProductSoldStatistic } from '../interfaces/DataInterfaces';
import { SalesHistory } from '../Types/Types';
import flatpickr from 'flatpickr';

class SalesHistoryController extends ModalController {
  #productData;
  #salesData;
  #editing;

  constructor(productData: ProductDataInterface, salesData: SalesDataInterface) {
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

  #renderTbody(products: Product[], salesHistory: SalesHistory) {
    const salesHistoryTable = $('#sales-history-table');
    salesHistoryTable.innerHTML = salesHistoryModalComponents.renderTable(products);
    salesHistoryTable.querySelector('tbody').innerHTML = salesHistory
      .map((eachSalesHistory) => salesHistoryModalComponents.renderTr(eachSalesHistory, products))
      .join('');
  }

  #renderTfoot(salesHistory: SalesHistory) {
    const totalAmount = salesHistory.reduce((acc, sales) => acc + sales.chargeAmount, 0);
    const productsNumber = Object.keys(this.#productData.getProducts()).map(Number);
    const productSold = salesHistory.map((sales) => sales.products).flat();
    const productSoldObj = productSold.reduce((acc: ProductSoldStatistic, product) => {
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
    $('#sales-history-table').addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('refund-button')) this.#refund(e);
    });
  }

  #getTargetTr(e: MouseEvent): HTMLTableRowElement {
    return (e.target as HTMLButtonElement).closest('tr') as HTMLTableRowElement;
  }

  #refund(e: MouseEvent) {
    const targetTr = this.#getTargetTr(e);
    if (targetTr.dataset.refund === undefined) return;
    if (!validator.validateRefund(targetTr.dataset.refund)) return;
    const [date, salesNumber] = this.#getDateAndSalesNumber(e);
    this.#salesData.refund(date, salesNumber);
    this.#renderSalesHistoryTable();
  }

  #getDateAndSalesNumber(e: MouseEvent): [string, number] {
    const targetTr = this.#getTargetTr(e);
    const date = (targetTr.querySelector('.date') as HTMLElement).innerText;
    const salesNumber = Number((targetTr.querySelector('.sales-number') as HTMLElement).innerText);
    return [date, salesNumber];
  }

  #addEditButtonEvent() {
    $('#sales-history-table').addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLButtonElement;
      if (!this.#editing && target.classList.contains('edit-button')) this.#handleEditButton(e);
      else if (this.#editing && target.classList.contains('submit-edit-button'))
        this.#handleSubmitButton(e);
    });
  }

  #handleEditButton(e: MouseEvent) {
    const targetTr = this.#getTargetTr(e);
    salesHistoryModalComponents.replaceNoteSpanWithInput(
      targetTr.querySelector('.note-span') as HTMLSpanElement,
    );
    this.#editing = true;
    salesHistoryModalComponents.replaceEditButtonToSubmit(e);
  }

  #handleSubmitButton(e: MouseEvent) {
    const targetTr = this.#getTargetTr(e);
    this.#editNote(e);
    salesHistoryModalComponents.replaceSubmitButtonToEdit(e);
    salesHistoryModalComponents.replaceNoteInputWithSpan(
      targetTr.querySelector('.note-input') as HTMLInputElement,
    );
    this.#editing = false;
  }

  #editNote(e: MouseEvent) {
    const targetTr = this.#getTargetTr(e);
    const targetInput = targetTr.querySelector('.note-input') as HTMLInputElement;
    const editedNote = targetInput.value;
    const [date, salesNumber] = this.#getDateAndSalesNumber(e);
    this.#salesData.editNote(date, salesNumber, editedNote);
  }
}

export default SalesHistoryController;
