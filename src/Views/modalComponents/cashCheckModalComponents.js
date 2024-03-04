/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../../utils/formatter.js';
import commonModalComponents from './commonModalComponents.js';

const cashCheckModalComponents = {
  renderCashCheckModal(cashSalesAmount, pettyCashAmount) {
    return `<div id="cash-check-modal">
    <div id="cash-check-container">
    <div><h3>현금 점검 실시</h3></div>
      <div id="cash-check-header">
        ${this.renderCashCheckHeader()}
      </div>
      <div id="cash-check-row">
        <span id="check-time">${formatter.formatTime(new Date())}</span>
        <span><input type="number" id="petty-cash-input" min=0 value="${pettyCashAmount ?? 0}" /></span>
        <span data-cash-sales-amount="${cashSalesAmount}" id="sales-cash">${formatter.formatNumber(
      cashSalesAmount,
    )}</span>
        <span id="expected-cash">${formatter.formatNumber(cashSalesAmount + pettyCashAmount ?? 0)}</span>
        <span id="counted-cash">0</span>
        <span id="correct-boolean">X</span>
        <span>
            <input data-currency="1000" class="currency-unit-input" type="number" min=0 />
        </span>
        <span>
            <input data-currency="5000" class="currency-unit-input" type="number" min=0 />
        </span>
        <span>
            <input data-currency="10000" class="currency-unit-input" type="number" min=0 />
        </span>
        <span>
            <input data-currency="50000" class="currency-unit-input" type="number" min=0 />
        </span>
      </div>
    </div>
    <div id="cash-check-history-container">
    <h3>현금 점검 내역</h3>
    <div id="cash-check-history-header">
        ${this.renderCashCheckHeader()}
    </div></div></div>${commonModalComponents.renderSubmitAndCancelButtons('cash-check')}`;
  },

  renderCashCheckHeader() {
    return `<span>점검시간</span>
        <span>준비금</span>
        <span>현금 판매 금액</span>
        <span>예상 현금</span>
        <span>실제 현금</span>
        <span>일치 여부</span>
        <span>1,000</span>
        <span>5,000</span>
        <span>10,000</span>
        <span>50,000</span>`;
  },

  renderCashCheckHistoryRow(history) {
    return `<div class="cash-check-history-row">
    <span>${history.time}</span>
    <span>${formatter.formatNumber(history.pettyCash)}</span>
    <span>${formatter.formatNumber(history.cashSalesAmount)}</span>
    <span>${formatter.formatNumber(history.expectedAmount)}</span>
    <span>${formatter.formatNumber(history.countedAmount)}</span>
    <span>${history.correctBoolean ? 'O' : 'X'}</span>
    <span>${formatter.formatNumber(history.currency[1000])}</span>
    <span>${formatter.formatNumber(history.currency[5000])}</span>
    <span>${formatter.formatNumber(history.currency[10000])}</span>
    <span>${formatter.formatNumber(history.currency[50000])}</span>
    </div>
    `;
  },
};

export default cashCheckModalComponents;
