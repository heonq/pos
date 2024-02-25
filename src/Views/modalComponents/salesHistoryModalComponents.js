/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../../utils/formatter.js';
import VALUES from '../../../constants/values.js';

const salesHistoryModalComponents = {
  renderSalesHistoryContainer() {
    return `<div id="date-select-section"><select id="date-select"></select><button id="search-button">조회</button></div>
        <div id="sales-history-container"></div>`;
  },

  renderTable(salesHistory, products) {
    return `<table>
        <thead>
        <tr id="thead-tr">
        <th>판매번호</th>
        <th>판매금액</th>
        <th>결제수단</th>
        <th>비고</th>
        <th>날짜</th>
        <th>시간</th>
        <th>반품</th>
        <th>수정</th>
        ${this.renderProductsTh(products)}
        </tr>
        </thead>
        <tbody>
        ${salesHistory.map((salesInfo) => this.renderTbody(salesInfo, products)).join('')}
    </tbody>
        </table>`;
  },

  renderProductsTh(products) {
    return products.map((product) => `<th class=${product.name}>${product.name}</th>`).join('');
  },

  renderSalesTd(productsData, productSaleHistory) {
    return productsData
      .map(
        (product) =>
          `<td class="quantity"><span data-product-name=${formatter.formatTextToDataSet(
            product.name,
          )} class="editable">${
            productSaleHistory.filter((productSold) => productSold.name === product.name)[0]?.quantity ?? 0
          }</span></td>`,
      )
      .join('');
  },

  renderTbody(salesInfo, productsData) {
    return `
        <tr>
          <td class="sales-number"><span>${salesInfo.number}</span></td>
          <td class="charge-amount"><span class="editable">${formatter.formatNumber(salesInfo.chargeAmount)}</span></td>
          <td class="payment-method"><span class="method">${salesInfo.method}</span></td>
          <td class="note"><span class="editable">${salesInfo.note}</span></td>
          <td class="date"><span class="editable">${salesInfo.date}</span></td>
          <td class="time"><span class="editable">${salesInfo.time}</span></td>
          <td class="refund-button"><button>반품</button></td>
          <td><button class="edit-button" data-sales-number=${salesInfo.number}>수정</button></td>
          ${this.renderSalesTd(productsData, salesInfo.products)}
        </tr>
        `;
  },

  replaceSpanWithInput(span) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.innerText;
    span.parentNode.replaceChild(input, span);
  },

  replaceMethodSpanWithSelect(method) {
    const select = document.createElement('select');
    select.class = 'method';
    VALUES.paymentMethods.forEach((eachMethod) => {
      const option = document.createElement('option');
      option.value = eachMethod;
      option.text = eachMethod;
      select.appendChild(option);
    });
    method.parentNode.replaceChild(select, method);
  },
};

export default salesHistoryModalComponents;
