import store from '../../utils/store.js';
import formatter from '../../utils/formatter';
import VALUES from '../../constants/values';
import deepCopy from '../../utils/deepCopy.js';
import { PaymentMethod, SalesHistory } from '../Types/Types';
import {
  PaymentInfo,
  SalesInfo,
  ShoppingCartProduct,
  SplitPayment,
} from '../interfaces/DataInterfaces.js';
import { SalesDataInterface } from '../interfaces/ModelInterfaces';
import FormGenerator from '../../utils/FormGenerator';

class SalesData implements SalesDataInterface {
  #salesInfo: SalesInfo;
  #salesHistory: SalesHistory;

  constructor() {
    this.initSalesHistory();
    this.#salesInfo = FormGenerator.generateSalesInfo();
    this.#salesHistory = [];
  }

  initSalesHistory(dateText: string = formatter.formatDate(new Date())) {
    if (!store.getStorage('salesHistories')) store.setStorage('salesHistories', { [dateText]: [] });
    this.#salesHistory = store.getStorage('salesHistories')[dateText] ?? [];
  }

  setSalesInfo(paymentInfo: PaymentInfo) {
    this.initSalesHistory();
    this.initSalesInfo(paymentInfo);
    this.handleETCInfo(paymentInfo);
    this.handleDiscountInfo(paymentInfo);
  }

  initSalesInfo({ chargeAmount, method }: { chargeAmount: number; method: PaymentMethod }) {
    const date = new Date();
    const products = this.#getShoppingCartWithoutName();
    this.#salesInfo = FormGenerator.generateSalesInfo(date, products, chargeAmount, method);
  }

  #getShoppingCartWithoutName(): ShoppingCartProduct[] {
    const products =
      store.getStorage('shoppingCart') ??
      [].map((product) => {
        const data = deepCopy(product);
        delete data.name;
        return data;
      });
    return products;
  }

  handleETCInfo(paymentInfo: PaymentInfo) {
    if (this.#salesInfo.method === '기타결제') {
      this.#salesInfo.chargeAmount = 0;
      this.#salesInfo.note = paymentInfo.ETCReason;
    }
  }

  handleDiscountInfo(paymentInfo: PaymentInfo) {
    const { discountType } = paymentInfo;
    const { discountValue } = paymentInfo;
    this.#salesInfo.discountValue = discountValue;
    if (paymentInfo.discountValue > 0 && discountType !== '') {
      this.#salesInfo.discountType = discountType;
      this.#salesInfo.discount = true;
      this.#salesInfo.note = `할인 사유 : ${paymentInfo.discountReason} 할인금액 : ${formatter.formatNumber(
        discountValue,
      )}${VALUES.discountType[discountType]}`;
    }
  }

  setSalesHistoryToStorage(paymentInfo: PaymentInfo, splitPayment: SplitPayment) {
    this.setSalesInfo(paymentInfo);
    if (paymentInfo.method === '분할결제') {
      this.handleSplitPayment(splitPayment);
    } else this.#salesHistory.push(this.#salesInfo);
    const salesHistories = store.getStorage('salesHistories');
    salesHistories[formatter.formatDate(new Date())] = this.#salesHistory;
    store.setStorage('salesHistories', salesHistories);
  }

  #getSalesHistoryForUpdate(
    date: string,
    salesNumber: number,
  ): [{ [key: string]: SalesHistory }, SalesInfo] {
    const totalSalesHistories: { [key: string]: SalesHistory } = store.getStorage('salesHistories');
    const originalHistory = totalSalesHistories[date][salesNumber - 1];
    return [totalSalesHistories, originalHistory];
  }

  refund(date: string, salesNumber: number) {
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

  #makeRefundHistory(originalHistory: SalesInfo): SalesInfo {
    const refundHistory = deepCopy(originalHistory);
    for (let i = 0; i < refundHistory.products.length; i += 1)
      refundHistory.products[i].quantity *= -1;
    refundHistory.chargeAmount *= -1;
    refundHistory.date = formatter.formatDate(new Date());
    refundHistory.time = formatter.formatTime(new Date());
    return refundHistory;
  }

  editNote(date: string, salesNumber: number, editedNote: string) {
    const [totalSalesHistories, originalHistory] = this.#getSalesHistoryForUpdate(
      date,
      salesNumber,
    );
    originalHistory.note = editedNote;
    store.setStorage('salesHistories', totalSalesHistories);
  }

  handleSplitPayment(splitPayment: SplitPayment) {
    this.#salesInfo.note += `분할결제 : ${this.#salesInfo.number},${this.#salesInfo.number + 1}`;
    splitPayment.amounts.forEach((amount, index) => {
      this.#salesInfo.chargeAmount = amount;
      this.#salesInfo.method = splitPayment.methods[index];
      this.#salesHistory.push({ ...this.#salesInfo });
      this.#salesInfo.products = [];
      this.#salesInfo.number += 1;
    });
  }

  getSalesNumber(): number {
    this.initSalesHistory();
    return this.#salesHistory[this.#salesHistory.length - 1]?.number ?? 0;
  }

  getSalesHistory(dateText: string): SalesHistory {
    this.initSalesHistory(dateText);
    return this.#salesHistory;
  }

  getDateWithSales(): string[] {
    return Object.keys(store.getStorage('salesHistories')).sort((a, b) => b.localeCompare(a));
  }

  getStatistic(dateText: string) {
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

  getTotalChargeAmount(filteredHistory: SalesHistory): number {
    return filteredHistory.reduce((acc, history) => acc + history.chargeAmount, 0);
  }

  getFilteredHistory(method: PaymentMethod): SalesHistory {
    return this.#salesHistory.filter((sale) => sale.method === method);
  }
}

export default SalesData;
