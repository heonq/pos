/* eslint-disable no-unused-expressions */
/* eslint-disable max-lines-per-function */

const modalComponents = {
  renderDiscountComponent() {
    return `<div id="discount-container">
    <div id="select-discount-type-section">
    <div id="percentage-section">
      <input type="radio" class="discount-checkbox" id="percentage-type-checkbox" name="discount" checked />
      <label for="percentage-type-checkbox">할인율 적용</label>
      </div>
      <div id="amount-section">
      <input type="radio" class="discount-checkbox" id="amount-type-checkbox" name="discount" />
      <label for="amount-type-checkbox">금액 적용</label>
      </div>
    </div>
    <div id="discount-info-section">
    <div id="discount-input-section">
    <input type="number" min="0" max="100" id="discount-input" /><span id="discount-text">%</span>
    </div>
    <div id="discount-amount-section">
    <div id="price-before-discount">할인 전 금액 : 0원</div>
    <div id="discount-amount">할인 금액 : 0원</div>
    <div id="price-after-discount">할인 후 금액 : 0원</div>
    </div>
    <div id="discount-reason-section">
    <div>할인 사유</div>
    <input type="text" id="discount-reason-input" />
    </div>
    </div>
    </div>
    ${this.renderSubmitAndCancelButtons()}
  `;
  },

  renderSubmitAndCancelButtons() {
    return `<div id="submit-buttons">
    <button>확인</button><button>취소</button>
    </div>`;
  },
};

export default modalComponents;
