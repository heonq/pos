/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../utils/formatter.js';

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
    <button class="${modalType}-submit" id="submit">확인</button><button class="${modalType}-cancel" id="cancel">취소</button>
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

  renderSalesHistory(salesHistory) {
    return `<div id="sales-history-container">
    ${this.renderTable(salesHistory)}
    </div>`;
  },

  renderTable(salesHistory) {
    return `<table>
    <thead>
    <tr>
    <th>판매번호</th>
    <th>판매금액</th>
    <th>결제수단</th>
    <th>비고</th>
    <th>날짜</th>
    <th>시간</th>
    <th>반품</th>
    <th>수정</th>
    </tr>
    </thead>
    <tbody>
${salesHistory.map((salesInfo) => this.renderTbody(salesInfo)).join('')}
</tbody>
    </table>`;
  },
  renderTbody(salesInfo) {
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
    </tr>
    `;
  },
};

export default modalComponents;
