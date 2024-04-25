import store from '../../utils/store.js';
import formatter from '../../utils/formatter';
import { CashCheck } from '../interfaces/DataInterfaces';
import { CashCheckDataInterface } from '../interfaces/ModelInterfaces';

class CashCheckData implements CashCheckDataInterface {
  #cashCheck: CashCheck = {
    time: '',
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

  setCashCheck(key: string, value: number) {
    this.#cashCheck[key] = value;
    this.#updateCountedAmount();
  }

  setCurrency(currencyUnit: number, value: number) {
    this.#cashCheck.currency[currencyUnit] = value;
    this.#updateCountedAmount();
  }

  #updateCountedAmount() {
    this.#cashCheck.countedAmount = Object.entries(this.#cashCheck.currency).reduce(
      (acc, [currency, count]) => acc + Number(currency) * count,
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

  getCashCheckHistories(): CashCheck[] {
    const date = formatter.formatDate(new Date());
    const cashCheckHistories = store.getStorage('cashCheckHistories') ?? { [date]: [] };
    return cashCheckHistories[date] ?? [];
  }

  getCountedAmount(): number {
    return this.#cashCheck.countedAmount;
  }

  getCorrectBoolean(): boolean {
    return this.#cashCheck.correctBoolean;
  }
}

export default CashCheckData;
