/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../../utils/formatter';
import { SalesHistoryModalComponentsInterface } from '../../interfaces/ViewInterfaces';

const salesHistoryModalComponents: SalesHistoryModalComponentsInterface = {
  renderSalesHistoryContainer() {
    return `
    <div id="sales-history-header"><h3 id="sales-history-title">판매내역</h3><button class="sales-history-close-button" id="close-button">X</button></div>
    <div id="date-select-section">
    <input id="date-select" placeholder="날짜 선택"></input>
    </div>
    <div id="sales-history-container">
    <div id="table-container">
    <table id="sales-history-table"></table>
    </div>
    </div>`;
  },

  renderTable(products) {
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
    </tbody>`;
  },

  renderProductsTh(products) {
    return products
      .map((product) => `<th data-product-number="${product.number}">${product.name}</th>`)
      .join('');
  },

  renderSalesTd(productsSold, productsData) {
    return productsData
      .map(
        (product) =>
          `<td class="quantity" data-product-name="${product.number}"><span>${
            productsSold.find((productSold) => productSold.number === product.number)?.quantity ?? 0
          }</span></td>`,
      )
      .join('');
  },

  renderTr(eachSalesHistory, productsData) {
    return `
        <tr data-refund="${eachSalesHistory.refund}">
          <td class="sales-number"><span>${eachSalesHistory.number}</span></td>
          <td class="charge-amount"><span>${formatter.formatNumber(eachSalesHistory.chargeAmount)}</span></td>
          <td class="payment-method"><span class="method-span">${eachSalesHistory.method}</span></td>
          <td class="note"><span class="note-span">${eachSalesHistory.note}</span></td>
          <td class="date"><span class="date-span">${eachSalesHistory.date}</span></td>
          <td class="time"><span>${eachSalesHistory.time}</span></td>
          <td><button class="refund-button">환불</button></td>
          <td><button class="edit-button">수정</button></td>
          ${this.renderSalesTd(eachSalesHistory.products, productsData)}
        </tr>
        `;
  },

  renderTfoot(totalAmount, productsQuantityArray) {
    return `<tfoot>
    <tr>
    <td>합계</td>
    <td>${formatter.formatNumber(totalAmount)}</td>
    <td colspan="6"></td>
    ${productsQuantityArray.map((productQuantity) => `<td><span>${productQuantity}</span></td>`).join('')}
    </tr>
    </tfoot>`;
  },

  replaceEditButtonToSubmit(e) {
    (e.target as HTMLElement).className = 'submit-edit-button';
    (e.target as HTMLElement).innerText = '확인';
  },

  replaceSubmitButtonToEdit(e) {
    (e.target as HTMLElement).className = 'edit-button';
    (e.target as HTMLElement).innerText = '수정';
  },

  replaceNoteSpanWithInput(span) {
    const noteInput = document.createElement('input');
    noteInput.className = 'note-input';
    noteInput.type = 'text';
    noteInput.value = span.innerText;
    span.parentNode!.replaceChild(noteInput, span);
  },

  replaceNoteInputWithSpan(input) {
    const noteSpan = document.createElement('span');
    noteSpan.className = 'note-span';
    noteSpan.innerText = input.value;
    input.parentNode!.replaceChild(noteSpan, input);
  },
};

export default salesHistoryModalComponents;
