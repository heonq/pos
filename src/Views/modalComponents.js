/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../utils/formatter.js';

const modalComponents = {
  renderDiscountComponent(discountInfo) {
    return `<div id="discount-container">
    <div id="select-discount-type-section">
    <div id="percentage-section">
      <input type="radio" class="discount-checkbox" value="percentage" id="percentage-type-checkbox" name="discount" ${
        discountInfo.type === 'percentage' ? 'checked' : ''
      } />
      <label for="percentage-type-checkbox">할인율 적용</label>
      </div>
      <div id="amount-section">
      <input type="radio" class="discount-checkbox" value="amount" id="amount-type-checkbox" name="discount" ${
        discountInfo.type === 'amount' ? 'checked' : ''
      } />
      <label for="amount-type-checkbox">금액 적용</label>
      </div>
    </div>
    <div id="discount-info-section">
    <div id="discount-input-section">
    <input type="number" value="${discountInfo.value}" min="0" ${
      discountInfo.type === 'percentage' ? 'max="100"' : ''
    } class=${discountInfo.type} id="discount-input" /><span id="discount-text">${
      discountInfo.type === 'percentage' ? '%' : '원'
    }</span>
    </div>
    <div id="discount-amount-section">
    <span>할인 전 금액 : ${formatter.formatNumber(discountInfo.chargeAmount + discountInfo.discountAmount)}원</span>
    <span>할인 금액 : ${formatter.formatNumber(discountInfo.discountAmount)}원</span>
    <span>할인 후 금액 : ${formatter.formatNumber(discountInfo.chargeAmount)}원</span>
    </div>
    <div id="discount-reason-section">
    <div>할인 사유</div>
    <input type="text" id="discount-reason-input" value="${discountInfo.reason}" />
    </div>
    </div>
    </div>
    ${this.renderSubmitAndCancelButtons('discount')}
  `;
  },

  renderSubmitAndCancelButtons(modalType) {
    return `<div id="submit-buttons">
    <button class="${modalType}-submit" id="submit">확인</button><button class="${modalType}-cancel" id="cancel">취소</button>
    </div>`;
  },
};

export default modalComponents;
