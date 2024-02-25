/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import commonModalComponents from './commonModalComponents.js';
import formatter from '../../../utils/formatter.js';

const discountModalComponents = {
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
        ${commonModalComponents.renderSubmitAndCancelButtons('discount')}
      `;
  },

  renderDiscountAmount(paymentInfo) {
    return `<span>할인 전 금액 : <span id="total-amount">${formatter.formatNumber(
      paymentInfo.totalAmount,
    )}</span>원</span>
        <span>할인 금액 : <span id="discount-amount">${formatter.formatNumber(
          paymentInfo.discountAmount,
        )}</span>원</span>
        <span>할인 후 금액 : <span id="charge-amount">${formatter.formatNumber(
          paymentInfo.totalAmount - paymentInfo.discountAmount,
        )}</span>원</span>`;
  },
};

export default discountModalComponents;
