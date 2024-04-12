/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */
import formatter from '../../../utils/formatter.js';
import commonModalComponents from './commonModalComponents.js';

const splitPaymentModalComponents = {
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
    </div>${commonModalComponents.renderSubmitAndCancelButtons('split-payment')}`;
  },
};

export default splitPaymentModalComponents;
