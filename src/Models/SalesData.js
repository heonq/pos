import store from '../../utils/store.js';
import formatter from '../../utils/formatter';
import VALUES from '../../constants/values.js';
import deepCopy from '../../utils/deepCopy.js';

class SalesData {
  #salesHistory;

  #salesInfo;

  constructor() {
    this.initSalesHistory();
  }

  initSalesHistory(dateText = formatter.formatDate(new Date())) {
    if (!store.getStorage('salesHistories')) store.setStorage('salesHistories', { [dateText]: [] });
    this.#salesHistory = store.getStorage('salesHistories')[dateText] ?? [];
  }

  setSalesInfo(paymentInfo) {
    this.initSalesHistory();
    this.initSalesInfo(paymentInfo);
    this.handleETCInfo(paymentInfo);
    this.handleDiscountInfo(paymentInfo);
  }

  initSalesInfo(paymentInfo) {
    const date = new Date();
    this.#salesInfo = {
      number: this.#salesHistory.length + 1,
      products: this.#getShoppingCartWithoutName(),
      chargeAmount: paymentInfo.chargeAmount,
      method: paymentInfo.method,
      date: formatter.formatDate(date),
      time: formatter.formatTime(date),
      discount: false,
      refund: false,
      discountType: '',
      note: '',
    };
  }

  #getShoppingCartWithoutName() {
    const products =
      store.getStorage('shoppingCart') ??
      [].map((product) => {
        const data = { ...product };
        delete data.name;
        return data;
      });
    return products;
  }

  handleETCInfo(paymentInfo) {
    if (this.#salesInfo.method === '기타결제') {
      this.#salesInfo.chargeAmount = 0;
      this.#salesInfo.note = paymentInfo.ETCReason;
    }
  }

  handleDiscountInfo(paymentInfo) {
    const { discountType } = paymentInfo;
    const { discountValue } = paymentInfo;
    this.#salesInfo.discountValue = discountValue;
    if (paymentInfo.discountValue > 0) {
      this.#salesInfo.discountType = discountType;
      this.#salesInfo.discount = true;
      this.#salesInfo.note = `할인 사유 : ${paymentInfo.discountReason} 할인금액 : ${formatter.formatNumber(
        discountValue,
      )}${VALUES.discountType[discountType]} `;
    }
  }

  setSalesHistoryToStorage(paymentInfo, splitPayment) {
    this.setSalesInfo(paymentInfo);
    if (paymentInfo.method === '분할결제') {
      this.handleSplitPayment(splitPayment);
    } else this.#salesHistory.push(this.#salesInfo);
    const salesHistories = store.getStorage('salesHistories');
    salesHistories[formatter.formatDate(new Date())] = this.#salesHistory;
    store.setStorage('salesHistories', salesHistories);
  }

  #getSalesHistoryForUpdate(date, salesNumber) {
    const totalSalesHistories = store.getStorage('salesHistories');
    const originalHistory = totalSalesHistories[date][salesNumber - 1];
    return [totalSalesHistories, originalHistory];
  }

  refund(date, salesNumber) {
    const [totalSalesHistories, originalHistory] = this.#getSalesHistoryForUpdate(
      date,
      salesNumber,
    );
    originalHistory.refund = true;
    const refundHistory = this.#makeRefundHistory(originalHistory);
    const today = formatter.formatDate(new Date());
    if (!totalSalesHistories[today]) totalSalesHistories[today] = [];
    refundHistory.number = totalSalesHistories[today].length + 1;
    refundHistory.note = `${date} ${salesNumber}번 환불`;
    totalSalesHistories[today].push(refundHistory);
    store.setStorage('salesHistories', totalSalesHistories);
  }

  #makeRefundHistory(originalHistory) {
    const refundHistory = deepCopy(originalHistory);
    for (let i = 0; i < refundHistory.products.length; i += 1)
      refundHistory.products[i].quantity *= -1;
    refundHistory.chargeAmount *= -1;
    refundHistory.date = formatter.formatDate(new Date());
    refundHistory.time = formatter.formatTime(new Date());
    return refundHistory;
  }

  editNote(date, salesNumber, editedNote) {
    const [totalSalesHistories, originalHistory] = this.#getSalesHistoryForUpdate(
      date,
      salesNumber,
    );
    originalHistory.note = editedNote;
    store.setStorage('salesHistories', totalSalesHistories);
  }

  handleSplitPayment(splitPayment) {
    this.#salesInfo.note += `분할결제 : ${this.#salesInfo.number},${this.#salesInfo.number + 1}`;
    splitPayment.amounts.forEach((amount, index) => {
      this.#salesInfo.chargeAmount = amount;
      this.#salesInfo.method = splitPayment.methods[index];
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
