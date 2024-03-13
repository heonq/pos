/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

const statisticModalComponents = {
  renderStatisticModalComponents() {
    return `<div id="statistic-modal">
    <div id="statistic-modal-header">
    <h3>판매 통계</h3>
    <button id="close-button">X</button>
    </div>
    <table id="statistic-table">
      <thead id="statistic-header">
      <tr>
        <th>날짜</th>
        <th>총 판매액</th>
        <th>카드 판매액</th>
        <th>현금 판매액</th>
        <th>계좌이체 판매액</th>
        </tr>
      </thead>
      <tbody id="statistic-body">
      </tbody>
      </table>
      <div id="plus-statistic-row-button-container"><button id="plus-statistic-row-button">+</button></div>
    </div>`;
  },
  renderStatisticRow() {
    return `<tr class="statistic-row">
      <td>
      <input class="statistic-date-select"></input>
      </td>
      <td class="statistic"></td>
      <td class="statistic"></td>
      <td class="statistic"></td>
      <td class="statistic"></td>
    </tr>`;
  },

  renderDateSelect(dates) {
    return dates.map((date) => `<option value="${date}">${date}</option>`);
  },
};

export default statisticModalComponents;
