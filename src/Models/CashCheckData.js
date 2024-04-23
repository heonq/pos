import store from '../../utils/store.js';
import formatter from '../../utils/formatter';

class CashCheckData {
  #cashCheck;

  // eslint-disable-next-line max-lines-per-function
  initCashCheck() {
    this.#cashCheck = {
      time: formatter.formatTime(new Date()),
      pettyCash: 0,
      cashSalesAmount: 0,
      currency: {
        1000: 0,
        5000: 0,
        10000: 0,
        50000: 0,
      },
      countedAmount: 0,
      expectedAmount: 0,
      correctBoolean: false,
    };
  }

  setCashCheck(key, value) {
    this.#cashCheck[key] = value;
    this.#updateCountedAmount();
  }

  setCurrency(currencyUnit, value) {
    this.#cashCheck.currency[currencyUnit] = value;
    this.#updateCountedAmount();
  }

  #updateCountedAmount() {
    this.#cashCheck.countedAmount = Object.entries(this.#cashCheck.currency).reduce(
      (acc, [currency, count]) => acc + currency * count,
      0,
    );
    if (this.#cashCheck.countedAmount === this.#cashCheck.expectedAmount)
      this.#cashCheck.correctBoolean = true;
    else this.#cashCheck.correctBoolean = false;
  }

  setCashCheckToStorage() {
    const date = formatter.formatDate(new Date());
    const cashCheckHistories = store.getStorage('cashCheckHistories') ?? { [date]: [] };
    const todaysCashCheck = cashCheckHistories[date] ?? [];
    cashCheckHistories[date] = [...todaysCashCheck, { ...this.#cashCheck }];
    store.setStorage('cashCheckHistories', cashCheckHistories);
  }

  getCashCheckHistories() {
    const date = formatter.formatDate(new Date());
    const cashCheckHistories = store.getStorage('cashCheckHistories') ?? { [date]: [] };
    return cashCheckHistories[date] ?? [];
  }

  getCountedAmount() {
    return this.#cashCheck.countedAmount;
  }

  getCorrectBoolean() {
    return this.#cashCheck.correctBoolean;
  }
}

export default CashCheckData;
