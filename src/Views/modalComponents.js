/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../utils/formatter.js';
import VALUES from '../../constants/values.js';

const modalComponents = {
  renderDiscountComponent(paymentInfo) {
    return `<div id="discount-container">
    <div id="select-discount-type-section">
    <div id="percentage-section">
      <input type="radio" class="discount-checkbox" value="percentage" id="percentage-type-checkbox" name="discount" ${
        paymentInfo.discountType === 'percentage' ? 'checked' : ''
      } />
      <label for="percentage-type-checkbox">할인율 적용</label>
      </div>
      <div id="amount-section">
      <input type="radio" class="discount-checkbox" value="amount" id="amount-type-checkbox" name="discount" ${
        paymentInfo.discountType === 'amount' ? 'checked' : ''
      } />
      <label for="amount-type-checkbox">금액 적용</label>
      </div>
    </div>
    <div id="discount-info-section">
    <div id="discount-input-section">
    <input type="number" value="${
      paymentInfo.discountType === 'percentage' ? paymentInfo.discountValue : paymentInfo.discountAmount
    }" min="0" ${paymentInfo.discountType === 'percentage' ? 'max="100"' : ''} class=${
      paymentInfo.type
    } id="discount-input" /><span id="discount-text">${paymentInfo.discountType === 'percentage' ? '%' : '원'}</span>
    </div>
    <div id="discount-amount-section">
    ${this.renderDiscountAmount(paymentInfo)}
    </div>
    <div id="discount-reason-section">
    <div>할인 사유</div>
    <input type="text" id="discount-reason-input" value="${paymentInfo.discountReason}" />
    </div>
    </div>
    </div>
    ${this.renderSubmitAndCancelButtons('discount')}
  `;
  },

  renderDiscountAmount(paymentInfo) {
    return `<span>할인 전 금액 : <span id="total-amount">${formatter.formatNumber(
      paymentInfo.totalAmount,
    )}</span>원</span>
    <span>할인 금액 : <span id="discount-amount">${formatter.formatNumber(paymentInfo.discountAmount)}</span>원</span>
    <span>할인 후 금액 : <span id="charge-amount">${formatter.formatNumber(
      paymentInfo.totalAmount - paymentInfo.discountAmount,
    )}</span>원</span>`;
  },

  renderSubmitAndCancelButtons(modalType) {
    return `<div id="submit-buttons">
    <button class="${modalType}-submit submit-button" id="submit" disabled>확인</button><button class="${modalType}-cancel cancel-button" id="cancel">취소</button>
    </div>`;
  },

  renderSplitPaymentComponent(paymentInfo) {
    return `<div id="split-payment-container">
    <div id="total-amount">총 결제금액 : ${formatter.formatNumber(paymentInfo.chargeAmount)}원</div>
      <div id="first-split-section">
      <input type="number" id="first-split-input" class="split-payment-input" />
      <select name="payment-methods" id="first-method">
      <option value="카드결제">카드결제</option>
      <option value="현금결제">현금결제</option>
      <option value="계좌이체">계좌이체</option>
      </select>
      </div>
      <div id="second-split-section">
      <input type="number" id="second-split-input" class="split-payment-input" />
      <select name="payment-methods" id="second-method">
      <option value="카드결제">카드결제</option>
      <option value="현금결제">현금결제</option>
      <option value="계좌이체">계좌이체</option>
      </select>
      </div>
    </div>${this.renderSubmitAndCancelButtons('split-payment')}`;
  },

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
            productSaleHistory.filter((productSold) => productSold.name == product.name)[0]?.quantity ?? 0
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
    VALUES.paymentMethods.forEach((method) => {
      const option = document.createElement('option');
      option.value = method;
      option.text = method;
      select.appendChild(option);
    });
    method.parentNode.replaceChild(select, method);
  },

  renderProductRegistration() {
    return `<div id="product-registration-modal">
    <div id="product-registration-container">
    <div id="product-registration-header">
    <span>상품명</span>
    <span>가격</span>
    <span>바코드</span>
    <span>카테고리</span>
    <span>전시여부</span>
    <span>삭제</span>
    </div>
    ${this.renderProductInputs()}
    </div>
    <div>
    <button id="plus-product-input-button">+</button>
    </div>
    </div>
    ${this.renderSubmitAndCancelButtons('product-registration')}
    `;
  },
  renderOptions(select, categories) {
    const options = [];
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.text = category;
      options.push(option);
    });
    options.forEach((option) => select.appendChild(option));
  },

  renderProductInputs() {
    return `<div class="product-inputs-row">
      <div><input class="product-name-input" /></div>
      <div><input class="product-price-input" /></div>
      <div><input class="product-barcode-input" /></div>
      <div><select class="product-categories-select"></select></div>
      <div><select class="product-display-select">
        <option value="true">전시</option>
        <option value="false">숨김</option>
      </select></div>
      <div><button class="product-delete-button">삭제</button></div>
    </div>`;
  },

  renderProductManagementContainer() {
    return `<div id="product-management-container" class="product-container">
      <div id="product-management-buttons">
        <select>
          <option hidden>선택한 상품 수정하기</option>
          <option>선택한 상품 삭제</option>
          <option>선택한 상품 보이기/숨기기</option>
          <option>선택한 상품 카테고리 변경</option>
        </select>
        <select id="search-by-category">
          <option hidden>카테고리</option>
        </select>
        <select id="search-by-display">
          <option hidden>전시상태</option>
          <option value="true">전시</option>
          <option value="false">숨김</option>
        </select>
        <button id="management-search-button">검색</button>
      </div>
      <div id="product-lists-container">
      <div id="product-list-header">
      <div><input type="checkbox" class="select-total-product-button" /></div>
      <div>상품명</div>
      <div>가격</div>
      <div>바코드</div>
      <div>카테고리</div>
      <div>전시여부</div>
      <div>판매수량</div>
      <div>삭제</div>
      </div>
      </div>
    </div>${this.renderSubmitAndCancelButtons('product-management')}`;
  },

  renderProductsInputs(product) {
    return `<div data-product-number=${product.number} class="product-management-row product-inputs-row">
      <div><input type="checkbox" class="select-product-button" /></div>
      <div><input class="product-name-input" value=${product.name}></div>
      <div><input class="product-price-input" value=${product.price}></div>
      <div><input class="product-barcode-input" value=${product.barcode}></div>
      <div>
      <select data-category=${product.category} class="product-categories-select">
      </select>
      </div>
      <div>
      <select>
      <option ${product.display ? 'selected' : ''}>전시</option>
      <option ${product.display ? '' : 'selected'}>숨김</option>
      </select>
      </div>
      <div>
      ${product.salesQuantity}
      </div>
      <div><button class="product-delete-button">삭제</button></div>
    </div>`;
  },
};

export default modalComponents;
