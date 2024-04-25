import ModalController from '../core/modalController';
import $ from '../../utils/index.js';
import cashCheckModalComponents from '../Views/modalComponents/cashCheckModalComponents.js';
import formatter from '../../utils/formatter';
import validator from '../../utils/validator';
import { CashCheckDataInterface, SalesDataInterface } from '../interfaces/ModelInterfaces';

class CashCheckController extends ModalController {
  constructor(
    private salesData: SalesDataInterface,
    private cashCheckData: CashCheckDataInterface,
  ) {
    super();
  }

  init() {
    $('#cash-check-button').addEventListener('click', this.renderCashCheckModal.bind(this));
  }

  private renderCashCheckModal() {
    const cashCheckHistories = this.cashCheckData.getCashCheckHistories();
    const pettyCash = cashCheckHistories.length
      ? cashCheckHistories[cashCheckHistories.length - 1].pettyCash
      : 0;
    const cashSalesAmount = this.salesData.getStatistic(
      formatter.formatDate(new Date()),
    ).cashAmount;
    this.cashCheckData.initCashCheck();
    this.cashCheckData.setCashCheck('cashSalesAmount', cashSalesAmount);
    $('#modal-container').innerHTML = cashCheckModalComponents.renderCashCheckModal(
      cashSalesAmount,
      pettyCash,
    );
    this.calculateExpectedCash();
    this.showModal('wide');
    this.addEvents();
    this.renderCashCheckHistories();
  }

  private addEvents() {
    this.addCalculateExpectedCashEvent();
    this.addUpdateCurrencyUnitCountEvent();
    this.addSubmitButtonEvent('cash-check-submit', () => {
      this.setCashCheckToStorage();
      this.hideModal();
    });
    this.addCancelButtonEvent();
  }

  private addCalculateExpectedCashEvent() {
    $('#petty-cash-input').addEventListener('input', () => {
      this.calculateExpectedCash();
      this.checkAllInputFilled();
      this.renderCorrectBoolean();
    });
  }

  private calculateExpectedCash() {
    const pettyCash = Number($('#petty-cash-input').value);
    const expectedAmount = pettyCash + Number($('#sales-cash').dataset.cashSalesAmount);
    $('#expected-cash').innerText = formatter.formatNumber(expectedAmount);
    this.cashCheckData.setCashCheck('pettyCash', pettyCash);
    this.cashCheckData.setCashCheck('expectedAmount', expectedAmount);
  }

  private addUpdateCurrencyUnitCountEvent() {
    $('#cash-check-row')
      .querySelectorAll('.currency-unit-input')
      .forEach((input: HTMLInputElement) => {
        input.addEventListener('input', this.currencyUnitCount.bind(this));
      });
  }

  private currencyUnitCount(e: Event) {
    const inputEvent = e as InputEvent;
    this.updateCurrencyUnitCount(inputEvent);
    this.checkAllInputFilled();
    this.renderCorrectBoolean();
  }

  private updateCurrencyUnitCount(e: InputEvent) {
    const currency = Number((e.target as HTMLInputElement).dataset.currency);
    this.cashCheckData.setCurrency(currency, Number((e.target as HTMLInputElement).value));
    $('#counted-cash').innerText = formatter.formatNumber(this.cashCheckData.getCountedAmount());
  }

  private renderCashCheckHistories() {
    const cashCheckHistories = this.cashCheckData.getCashCheckHistories();
    if (!cashCheckHistories.length) return;
    const historyComponents = cashCheckHistories
      .map((history) => cashCheckModalComponents.renderCashCheckHistoryRow(history))
      .join('');
    $('#cash-check-history-body').insertAdjacentHTML('beforeend', historyComponents);
  }

  private checkAllInputFilled() {
    if (
      $('#cash-check-row')
        .querySelectorAll('input')
        .every((input: HTMLInputElement) => input.value !== '')
    )
      return this.enableSubmitButton();
    return this.disableSubmitButton();
  }

  private setCashCheckToStorage() {
    const values = $('#cash-check-row')
      .querySelectorAll('input')
      .map((input: HTMLInputElement) => input.value);
    if (!validator.validateCashCheckInputs(values)) return;
    this.cashCheckData.setCashCheckToStorage();
  }

  private renderCorrectBoolean() {
    if (this.cashCheckData.getCorrectBoolean()) $('#correct-boolean').innerText = 'O';
    else $('#correct-boolean').innerText = 'X';
  }
}

export default CashCheckController;
