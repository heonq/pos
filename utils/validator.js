/* eslint-disable no-restricted-globals */
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

  validateProductsNames(products) {
    const productNames = products.map((product) => product.name);
    if (!this.validateDuplicatedNames(productNames)) return false;
    if (!this.validateBlankNames(productNames)) return false;
    if (!this.validateLastStringBlank(productNames)) return false;
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
    if (!prices.every((price) => this.validateInteger(price))) {
      alert(`가격은 0 이상의 자연수여야 합니다.`);
      return false;
    }
    return true;
  },

  validateInteger(number) {
    const regex = /[^0-9]/g;
    if (Number(number) < 0 || regex.test(number)) {
      return false;
    }
    return true;
  },

  validateProductRegistration(products) {
    if (!this.validateProductsNames(products) || !this.validateBarcodes(products) || !this.validatePrice(products))
      return false;
    return true;
  },

  validateSalesQuantity(salesQuantity) {
    if (salesQuantity > 0) {
      alert('판매 내역이 존재하는 상품은 삭제할 수 없습니다.');
      return false;
    }
    return true;
  },

  validateSelectedRows(rowsLength) {
    if (rowsLength <= 0) {
      alert('한 개 이상의 상품을 선택해야 합니다.');
      return false;
    }
    return true;
  },

  validateCategories(categories) {
    const categoryNames = categories.map((category) => category.name);
    if (!this.validateDuplicatedNames(categoryNames)) return false;
    if (!this.validateBlankNames(categoryNames)) return false;
    if (!this.validateLastStringBlank(categoryNames)) return false;
    return true;
  },

  validateDuplicatedNames(names) {
    const duplicatedNames = [...new Set(names.filter((name) => names.lastIndexOf(name) !== names.indexOf(name)))];
    if (duplicatedNames.length) {
      alert(`중복된 이름이 존재합니다. : ${duplicatedNames.join(',')}`);
      return false;
    }
    return true;
  },

  validateBlankNames(names) {
    const regex = /^\s*$/;
    if (names.some((name) => regex.test(name))) {
      alert('이름은 공백으로 설정할 수 없습니다.');
      return false;
    }
    return true;
  },

  validateLastStringBlank(names) {
    const regex = /^\s*|\s*$/;
    if (names.some((name) => regex.test(name))) {
      alert('이름의 첫번째와 마지막 글자는 공백으로 설정할 수 없습니다.');
      return false;
    }
    return true;
  },

  validateCategoryDelete(categoryNumber, products) {
    if (categoryNumber === 1) {
      alert('기본 카테고리는 삭제할 수 없습니다.');
      return false;
    }
    if (products.some((product) => Number(product.category) === Number(categoryNumber))) {
      alert('상품이 존재하는 카테고리는 삭제할 수 없습니다.');
      return false;
    }
    return true;
  },

  validateCashCheckInputs(values) {
    if (!values.every((value) => this.validateInteger(value))) {
      alert('0 이상의 자연수를 입력해주세요.');
      return false;
    }
    return true;
  },

  validateRefund(refundHistory) {
    if (!confirm('선택하신 주문 건을 반품하시겠습니까?')) return false;
    if (refundHistory === 'true') {
      alert('이미 환불이 완료된 주문 건 입니다.');
      return false;
    }
    return true;
  },
};

export default validator;
