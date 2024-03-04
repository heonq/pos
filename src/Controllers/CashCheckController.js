import ModalController from '../core/modalController.js';
import $ from '../../utils/index.js';
import cashCheckModalComponents from '../Views/modalComponents/cashCheckModalComponents.js';
import formatter from '../../utils/formatter.js';
import validator from '../../utils/validator.js';

class CashCheckController extends ModalController {
  #salesData;

  #cashCheckData;

  constructor(salesData, cashCheckData) {
    super();
    this.#salesData = salesData;
    this.#cashCheckData = cashCheckData;
  }

  init() {
    $('#cash-check-button').addEventListener('click', this.#renderCashCheckModal.bind(this));
  }

  #renderCashCheckModal() {
    const cashCheckHistories = this.#cashCheckData.getCashCheckHistories();
    const pettyCash = cashCheckHistories.length ? cashCheckHistories[cashCheckHistories.length - 1].pettyCash : 0;
    const cashSalesAmount = this.#salesData.getStatistic(formatter.formatDate(new Date())).cashAmount;
    this.#cashCheckData.initCashCheck();
    this.#cashCheckData.setCashCheck('cashSalesAmount', cashSalesAmount);
    $('#modal-container').innerHTML = cashCheckModalComponents.renderCashCheckModal(cashSalesAmount, pettyCash);
    this.#calculateExpectedCash();
    this.showModal('wide');
    this.#addEvents();
    this.#renderCashCheckHistories();
  }

  #addEvents() {
    this.#addCalculateExpectedCashEvent();
    this.#addUpdateCurrencyUnitCountEvent();
    this.addSubmitButtonEvent('cash-check-submit', () => {
      this.#setCashCheckToStorage();
      this.hideModal();
    });
    this.addCancelButtonEvent();
  }

  #addCalculateExpectedCashEvent() {
    $('#petty-cash-input').addEventListener('input', (e) => {
      this.#calculateExpectedCash();
      this.#checkAllInputFilled();
      this.#renderCorrectBoolean();
    });
  }

  #calculateExpectedCash() {
    const pettyCash = Number($('#petty-cash-input').value);
    const expectedAmount = pettyCash + Number($('#sales-cash').dataset.cashSalesAmount);
    $('#expected-cash').innerText = formatter.formatNumber(expectedAmount);
    this.#cashCheckData.setCashCheck('pettyCash', pettyCash);
    this.#cashCheckData.setCashCheck('expectedAmount', expectedAmount);
  }

  #addUpdateCurrencyUnitCountEvent() {
    $('#cash-check-row')
      .querySelectorAll('.currency-unit-input')
      .forEach((input) => {
        input.addEventListener('input', (e) => {
          this.#updateCurrencyUnitCount(e);
          this.#checkAllInputFilled();
          this.#renderCorrectBoolean();
        });
      });
  }

  #updateCurrencyUnitCount(e) {
    const currency = Number(e.target.dataset.currency);
    this.#cashCheckData.setCurrency(currency, e.target.value);
    $('#counted-cash').innerText = formatter.formatNumber(this.#cashCheckData.getCountedAmount());
  }

  #renderCashCheckHistories() {
    const cashCheckHistories = this.#cashCheckData.getCashCheckHistories();
    if (!cashCheckHistories.length) return;
    const historyComponents = cashCheckHistories
      .map((history) => cashCheckModalComponents.renderCashCheckHistoryRow(history))
      .join('');
    $('#cash-check-history-container').insertAdjacentHTML('beforeend', historyComponents);
  }

  #checkAllInputFilled() {
    if (Array.from($('#cash-check-row').querySelectorAll('input')).every((input) => input.value !== ''))
      return this.enableSubmitButton();
    return this.disableSubmitButton();
  }

  #setCashCheckToStorage() {
    const values = Array.from($('#cash-check-row').querySelectorAll('input')).map((input) => input.value);
    if (!validator.validateCashCheckInputs(values)) return;
    this.#cashCheckData.setCashCheckToStorage();
  }

  #renderCorrectBoolean() {
    if (this.#cashCheckData.getCorrectBoolean()) $('#correct-boolean').innerText = 'O';
    else $('#correct-boolean').innerText = 'X';
  }
}

export default CashCheckController;
