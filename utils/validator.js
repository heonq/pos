/* eslint-disable no-alert */

const validator = {
  validateDiscount(type, discountValue, totalAmount) {
    if (type === 'percentage') return this.validatePercentage(discountValue);
    return this.validateAmount(discountValue, totalAmount);
  },

  validatePercentage(discountValue) {
    if (discountValue > 100) {
      alert('할인 금액은 총 결제 금액보다 적게 입력해주세요.');
      return false;
    }
    return true;
  },
  validateAmount(discountValue, totalAmount) {
    if (discountValue > totalAmount) {
      alert('할인 금액은 총 결제 금액보다 적게 입력해주세요.');
      return false;
    }
    return true;
  },

  validateTotalAmount(totalAmount) {
    if (totalAmount === 0) {
      alert('결제 금액이 존재해야 합니다.');
      return false;
    }
    return true;
  },

  validateSplitPayment(paymentMethods, amounts, totalAmount) {
    const totalSplitAmount = amounts.reduce((acc, curr) => acc + Number(curr), 0);
    if (paymentMethods.some((method) => method === '')) {
      alert('결제 수단을 선택해주세요.');
      return false;
    }
    if (totalSplitAmount !== totalAmount || amounts.some((amount) => amount <= 0)) {
      alert('결제 금액을 올바르게 입력해주세요.');
      return false;
    }
    return true;
  },

  validatePaymentMethod(paymentInfo) {
    if (paymentInfo.method === '') {
      alert('결제 수단을 선택해주세요.');
      return false;
    }
    return true;
  },
};

export default validator;
