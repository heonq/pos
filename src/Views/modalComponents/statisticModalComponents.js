/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../../utils/formatter.js';

const statisticModalComponents = {
  renderStatisticModalComponents() {
    return `<div id="statistic-container">
    <div id="statistic-row-container">
      <div id="statistic-header">
        <span>날짜</span>
        <span>총 판매액</span>
        <span>카드 판매액</span>
        <span>현금 판매액</span>
        <span>계좌이체 판매액</span>
        <span>삭제</span>
      </div>
      </div>
      <div><button id="plus-statistic-row-button">+</button></div>
    </div>`;
  },
  renderStatisticRow() {
    return `<div class="statistic-row">
      <span>
      <input class="statistic-date-select" placeholder="날짜 선택"></input>
      </span>
      <div class="statistic-content"></div>
      <span>
      <button class="statistic-delete-button">삭제</button>
      </span>
    </div>`;
  },

  renderStatistic(salesStatistic) {
    return `<span>${formatter.formatNumber(salesStatistic.totalAmount)}</span>
    <span>${formatter.formatNumber(salesStatistic.cardAmount)}</span>
    <span>${formatter.formatNumber(salesStatistic.cashAmount)}</span>
    <span>${formatter.formatNumber(salesStatistic.wireAmount)}</span>`;
  },

  renderDateSelect(dates) {
    return dates.map((date) => `<option value="${date}">${date}</option>`);
  },
};

export default statisticModalComponents;
