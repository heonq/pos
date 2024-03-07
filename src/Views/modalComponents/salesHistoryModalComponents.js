/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../../utils/formatter.js';

const salesHistoryModalComponents = {
  renderSalesHistoryContainer() {
    return `
    <div id="sales-history-header"><h3 id="sales-history-title">판매내역</h3><button id="close-button">X</button></div>
    <div id="date-select-section">
    <input id="date-select" placeholder="날짜 선택"></input>
    </div>
    <div id="sales-history-container">
    <div id="table-container">
    <table id="sales-history-table"></table>
    </div>
    </div>`;
  },

  renderTable(salesHistory, products) {
    return `<thead>
        <tr id="thead-tr">
        <th>판매번호</th>
        <th>판매금액</th>
        <th>결제수단</th>
        <th>비고</th>
        <th>날짜</th>
        <th>시간</th>
        <th>환불</th>
        <th>수정</th>
        ${this.renderProductsTh(products)}
        </tr>
        </thead>
        <tbody>
        ${salesHistory.map((salesInfo) => this.renderTr(salesInfo, products)).join('')}
    </tbody>`;
  },

  renderProductsTh(products) {
    return products.map((product) => `<th data-product-number="${product.number}">${product.name}</th>`).join('');
  },

  renderSalesTd(productsData, productSaleHistory) {
    return productsData
      .map(
        (product) =>
          `<td class="quantity" data-product-name="${product.number}"><span>${
            productSaleHistory.filter((productSold) => productSold.number === product.number)[0]?.quantity ?? 0
          }</span></td>`,
      )
      .join('');
  },

  renderTr(salesInfo, productsData) {
    return `
        <tr data-refund="${salesInfo.refund}">
          <td class="sales-number"><span>${salesInfo.number}</span></td>
          <td class="charge-amount"><span>${formatter.formatNumber(salesInfo.chargeAmount)}</span></td>
          <td class="payment-method"><span class="method-span">${salesInfo.method}</span></td>
          <td class="note"><span class="note-span">${salesInfo.note}</span></td>
          <td class="date"><span class="date-span">${salesInfo.date}</span></td>
          <td class="time"><span>${salesInfo.time}</span></td>
          <td><button class="refund-button">환불</button></td>
          <td><button class="edit-button">수정</button></td>
          ${this.renderSalesTd(productsData, salesInfo.products)}
        </tr>
        `;
  },

  replaceEditButtonToSubmit(e) {
    e.target.className = 'submit-edit-button';
    e.target.innerText = '확인';
  },

  replaceSubmitButtonToEdit(e) {
    e.target.className = 'edit-button';
    e.target.innerText = '수정';
  },

  replaceNoteSpanWithInput(span) {
    const noteInput = document.createElement('input');
    noteInput.className = 'note-input';
    noteInput.type = 'text';
    noteInput.value = span.innerText;
    span.parentNode.replaceChild(noteInput, span);
  },

  replaceNoteInputWithSpan(input) {
    const noteSpan = document.createElement('span');
    noteSpan.className = 'note-span';
    noteSpan.innerText = input.value;
    input.parentNode.replaceChild(noteSpan, input);
  },
};

export default salesHistoryModalComponents;
