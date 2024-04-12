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
    <div>
    <h3>현금 점검 내역</h3>
    <table id="cash-check-history-table">
        ${this.renderCashCheckHistoryHeader()}
    </table></div></div>${commonModalComponents.renderSubmitAndCancelButtons('cash-check')}`;
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

  renderCashCheckHistoryHeader() {
    return `
    <thead id="cash-check-history-header">
    <tr>
    <th>점검시간</th>
    <th>준비금</th>
    <th>현금 판매 금액</th>
    <th>예상 현금</th>
    <th>실제 현금</th>
    <th>일치 여부</th>
    <th>1,000</th>
    <th>5,000</th>
    <th>10,000</th>
    <th>50,000</th>
    </tr>
    </thead>
    <tbody id="cash-check-history-body"></tbody>
    `;
  },

  renderCashCheckHistoryRow(history) {
    return `<tr class="cash-check-history-row">
    <td>${history.time}</td>
    <td>${formatter.formatNumber(history.pettyCash)}</td>
    <td>${formatter.formatNumber(history.cashSalesAmount)}</td>
    <td>${formatter.formatNumber(history.expectedAmount)}</td>
    <td>${formatter.formatNumber(history.countedAmount)}</td>
    <td>${history.correctBoolean ? 'O' : 'X'}</td>
    <td>${formatter.formatNumber(history.currency[1000])}</td>
    <td>${formatter.formatNumber(history.currency[5000])}</td>
    <td>${formatter.formatNumber(history.currency[10000])}</td>
    <td>${formatter.formatNumber(history.currency[50000])}</td>
    </tr>
    `;
  },
};

export default cashCheckModalComponents;
