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

  validateNames(productNames) {
    if (productNames.some((name) => name === '')) {
      alert('상품명을 입력해주세요.');
      return false;
    }
    const duplicatedNames = [
      ...new Set(
        productNames.filter(
          (productName) => productNames.lastIndexOf(productName) !== productNames.indexOf(productName),
        ),
      ),
    ];
    if (duplicatedNames.length) {
      alert(`중복된 상품명이 존재합니다. 중복된 상품 : ${duplicatedNames.join(',')}`);
      return false;
    }
    return true;
  },

  validateBarcodes(products) {
    const exceptBlank = products.filter((product) => product.barcode !== '');
    const barcodes = exceptBlank.map((product) => product.barcode);
    const duplicatedBarcodes = barcodes.filter(
      (barcode) => barcodes.lastIndexOf(barcode) !== barcodes.indexOf(barcode),
    );
    const duplicatedProducts = exceptBlank
      .filter((product) => duplicatedBarcodes.includes(product.barcode))
      .map((product) => product.name);
    if (duplicatedProducts.length) {
      alert(`중복된 바코드가 존재합니다. 상품명 : ${duplicatedProducts.join(',')}`);
      return false;
    }
    return true;
  },

  validatePrice(products) {
    const prices = products.map((product) => product.price);
    const regex = /[^0-9]/g;
    if (prices.some((price) => Number(price) < 0 || regex.test(price))) {
      alert(`가격은 0 이상의 자연수여야 합니다.`);
      return false;
    }
    return true;
  },

  validateSalesQuantity(salesQuantity) {
    if (salesQuantity > 0) {
      alert('판매 내역이 존재하는 상품을 삭제하거나 이름을 변경할 수 없습니다.');
      return false;
    }
    return true;
  },
};

export default validator;
