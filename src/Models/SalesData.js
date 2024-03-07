import store from '../../utils/store.js';
import formatter from '../../utils/formatter.js';
import VALUES from '../../constants/values.js';

class SalesData {
  #salesHistory;

  #paymentInfo;

  #splitPayment;

  #salesInfo;

  #shoppingCartData;

  constructor(shoppingCartData) {
    this.#shoppingCartData = shoppingCartData;
    this.#getPaymentInfoFromStorage();
    this.initSplitPayment();
    this.initSalesHistory();
  }

  initPaymentInfo() {
    this.#setDefaultPaymentInfo();
    this.#setPaymentInfoToStorage();
  }

  getPaymentInfo() {
    this.#getPaymentInfoFromStorage();
    return this.#paymentInfo;
  }

  #setPaymentInfoToStorage() {
    store.setStorage('paymentInfo', this.#paymentInfo);
  }

  #getPaymentInfoFromStorage() {
    this.#setDefaultPaymentInfo();
    if (store.getStorage('paymentInfo')) this.#paymentInfo = store.getStorage('paymentInfo');
  }

  #setDefaultPaymentInfo() {
    const totalAmount = this.#shoppingCartData.getTotalAmount();
    this.#paymentInfo = {
      method: '',
      discountType: 'percentage',
      totalAmount,
      discountAmount: 0,
      discountValue: 0,
      chargeAmount: totalAmount,
      discountReason: '',
      ETCReason: '',
    };
  }

  updatePaymentMethod(method) {
    this.#getPaymentInfoFromStorage();
    this.#paymentInfo.method = method;
    this.#setPaymentInfoToStorage();
  }

  updateDiscount(discountValue, discountReason) {
    this.updateDiscountValue(discountValue);
    this.#paymentInfo.discountReason = discountReason;
    this.#setPaymentInfoToStorage();
  }

  updateDiscountType(type) {
    this.#setDefaultPaymentInfo();
    this.#paymentInfo.discountType = type;
    this.#setPaymentInfoToStorage();
  }

  updateDiscountValue(discountValue) {
    this.#paymentInfo.discountValue = discountValue;
    this.#paymentInfo.discountAmount = discountValue;
    if (this.#paymentInfo.discountType === 'percentage')
      this.#paymentInfo.discountAmount = Math.floor(discountValue * this.#paymentInfo.totalAmount * 0.01);
    this.#paymentInfo.chargeAmount = this.#paymentInfo.totalAmount - this.#paymentInfo.discountAmount;
  }

  checkDiscountAmount() {
    return this.#paymentInfo.discountAmount > 0;
  }

  checkDiscountType() {
    return this.#paymentInfo.discountType === 'percentage';
  }

  saveSplitPayment(paymentMethod = [], amount = []) {
    this.#splitPayment.methods = paymentMethod;
    this.#splitPayment.amounts = amount.map(Number);
    store.setStorage('splitPayment', this.#splitPayment);
  }

  setDefaultSplitPayment() {
    this.#splitPayment = {
      methods: [],
      amounts: [],
    };
  }

  deactivateSplitPayment() {
    this.setDefaultSplitPayment();
    this.updatePaymentMethod('');
    store.setStorage('splitPayment', this.#splitPayment);
  }

  initSplitPayment() {
    this.setDefaultSplitPayment();
    if (store.getStorage('splitPayment')) this.#splitPayment = store.getStorage('splitPayment');
  }

  getSplitPayment() {
    this.initSplitPayment();
    return this.#splitPayment;
  }

  setETCReason(reason) {
    this.initPaymentInfo();
    this.updatePaymentMethod('기타결제');
    this.#paymentInfo.ETCReason = reason;
    this.#setPaymentInfoToStorage();
  }

  initSalesHistory(dateText = formatter.formatDate(new Date())) {
    if (!store.getStorage('salesHistories')) store.setStorage('salesHistories', { [dateText]: [] });
    this.#salesHistory = store.getStorage('salesHistories')[dateText] ?? [];
  }

  setSalesInfo() {
    this.initSalesHistory();
    this.initSalesInfo();
    this.handleETCInfo();
    this.handleDiscountInfo();
  }

  initSalesInfo() {
    const date = new Date();
    this.#salesInfo = {
      number: this.#salesHistory.length + 1,
      products: this.#getShoppingCartWithoutName(),
      chargeAmount: this.#paymentInfo.chargeAmount,
      method: this.#paymentInfo.method,
      date: formatter.formatDate(date),
      time: formatter.formatTime(date),
      discount: false,
      refund: false,
      discountType: '',
      note: '',
    };
  }

  #getShoppingCartWithoutName() {
    const products = this.#shoppingCartData.getShoppingCartData().map((product) => {
      const data = { ...product };
      delete data.name;
      return data;
    });
    return products;
  }

  handleETCInfo() {
    if (this.#salesInfo.method === '기타결제') {
      this.#salesInfo.chargeAmount = 0;
      this.#salesInfo.note = this.#paymentInfo.ETCReason;
    }
  }

  handleDiscountInfo() {
    const { discountType } = this.#paymentInfo;
    const { discountValue } = this.#paymentInfo;
    this.#salesInfo.discountValue = discountValue;
    if (this.#paymentInfo.discountValue > 0) {
      this.#salesInfo.discountType = discountType;
      this.#salesInfo.discount = true;
      this.#salesInfo.note = `할인 사유 : ${this.#paymentInfo.discountReason} 할인금액 : ${formatter.formatNumber(
        discountValue,
      )}${VALUES.discountType[discountType]} `;
    }
  }

  setSalesHistoryToStorage() {
    this.setSalesInfo();
    if (this.#paymentInfo.method === '분할결제') {
      this.handleSplitPayment();
    } else this.#salesHistory.push(this.#salesInfo);
    const salesHistories = store.getStorage('salesHistories');
    salesHistories[formatter.formatDate(new Date())] = this.#salesHistory;
    store.setStorage('salesHistories', salesHistories);
    this.initPaymentInfo();
  }

  #getSalesHistoryForUpdate(date, salesNumber) {
    const totalSalesHistories = store.getStorage('salesHistories');
    const salesHistoriesOfDate = totalSalesHistories[date];
    const originalHistory = salesHistoriesOfDate[salesNumber - 1];
    return [totalSalesHistories, salesHistoriesOfDate, originalHistory];
  }

  refund(date, salesNumber) {
    const [totalSalesHistories, salesHistoriesOfDate, originalHistory] = this.#getSalesHistoryForUpdate(
      date,
      salesNumber,
    );
    originalHistory.refund = true;
    const refundHistory = this.#makeRefundHistory(originalHistory);
    refundHistory.number = salesHistoriesOfDate.length + 1;
    refundHistory.note = `${date} ${salesNumber}번 환불`;
    totalSalesHistories[formatter.formatDate(new Date())].push(refundHistory);
    store.setStorage('salesHistories', totalSalesHistories);
  }

  #makeRefundHistory(originalHistory) {
    const refundHistory = { ...originalHistory };
    const products = refundHistory.products.map((product) => ({ ...product }));
    for (let i = 0; i < products.length; i += 1) products[i].quantity *= -1;
    refundHistory.products = products;
    refundHistory.chargeAmount *= -1;
    refundHistory.date = formatter.formatDate(new Date());
    refundHistory.time = formatter.formatTime(new Date());
    return refundHistory;
  }

  editNote(date, salesNumber, editedNote) {
    const [totalSalesHistories, _, originalHistory] = this.#getSalesHistoryForUpdate(date, salesNumber);
    originalHistory.note = editedNote;
    store.setStorage('salesHistories', totalSalesHistories);
  }

  handleSplitPayment() {
    this.initSplitPayment();
    this.#salesInfo.note += `분할결제 : ${this.#salesInfo.number},${this.#salesInfo.number + 1}`;
    this.#splitPayment.amounts.forEach((amount, index) => {
      this.#salesInfo.chargeAmount = amount;
      this.#salesInfo.method = this.#splitPayment.methods[index];
      this.#salesHistory.push({ ...this.#salesInfo });
      this.#salesInfo.products = [];
      this.#salesInfo.number += 1;
    });
  }

  getSalesNumber() {
    this.initSalesHistory();
    return this.#salesHistory[this.#salesHistory.length - 1]?.number ?? 0;
  }

  getSalesHistory(dateText) {
    this.initSalesHistory(dateText);
    return this.#salesHistory;
  }

  getDateWithSales() {
    return Object.keys(store.getStorage('salesHistories')).sort((a, b) => b.localeCompare(a));
  }

  getStatistic(dateText) {
    this.initSalesHistory(dateText);
    const totalAmount = this.getTotalChargeAmount(this.#salesHistory);
    const [cardAmount, cashAmount, wireAmount] = VALUES.methods.map((method) =>
      this.getTotalChargeAmount(this.getFilteredHistory(method)),
    );
    return {
      totalAmount,
      cardAmount,
      cashAmount,
      wireAmount,
    };
  }

  getTotalChargeAmount(filteredHistory) {
    return filteredHistory.reduce((acc, history) => acc + history.chargeAmount, 0);
  }

  getFilteredHistory(method) {
    return this.#salesHistory.filter((sale) => sale.method === method);
  }
}

export default SalesData;
