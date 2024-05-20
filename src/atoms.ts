import { atom, selector } from 'recoil';
import { IPaymentInfo, ISalesHistory, IShoppingCartProduct, ISplitPayment } from './Interfaces/DataInterfaces';
import FormGenerator from './utils/formGenerator';

export const viewModeAtom = atom({
  key: 'viewMode',
  default: 'category',
});

export const shoppingCartAtom = atom<IShoppingCartProduct[]>({
  key: 'shoppingCart',
  default: [],
});

export const shoppingCartSelector = selector<IShoppingCartProduct[]>({
  key: 'shoppingCartSelector',
  get: ({ get }) => {
    return get(shoppingCartAtom);
  },
  set: ({ set, reset }, newValue) => {
    set(shoppingCartAtom, newValue);
    reset(paymentInfoAtom);
    reset(splitPaymentAtom);
  },
});

export const paymentInfoAtom = atom<IPaymentInfo>({
  key: 'paymentInfo',
  default: FormGenerator.generatePaymentInfo(),
});

export const paymentInfoSelector = selector<IPaymentInfo>({
  key: 'paymentInfoSelector',
  get: ({ get }) => {
    const products = get(shoppingCartAtom);
    const paymentInfo = get(paymentInfoAtom);
    const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
    return {
      ...paymentInfo,
      totalAmount,
      chargedAmount: totalAmount,
    };
  },
  set: ({ set, reset }, newValue) => {
    set(paymentInfoAtom, newValue);
    reset(splitPaymentAtom);
  },
});

export const salesNumberAtom = atom({
  key: 'salesNumberState',
  default: 0,
});

export const salesHistoryAtom = atom<ISalesHistory>({
  key: 'salesHistory',
  default: FormGenerator.generateSalesHistory(),
});

export const salesHistorySelector = selector<ISalesHistory>({
  key: 'salesHistorySelector',
  get: ({ get }) => {
    const products = get(shoppingCartSelector);
    const paymentInfo = get(paymentInfoSelector);
    const salesNumber = get(salesNumberAtom) + 1;
    const salesHistory = get(salesHistoryAtom);
    return {
      number: salesNumber,
      products,
      ...paymentInfo,
      date: salesHistory.date,
      time: salesHistory.time,
      discount: paymentInfo.discountAmount > 0 ? true : false,
      refund: false,
    };
  },
  set: ({ set }, newValue) => {
    set(salesHistoryAtom, newValue);
  },
});

export const splitPaymentAtom = atom<ISplitPayment>({
  key: 'splitPayment',
  default: {
    price: [0, 0],
    method: ['', ''],
  },
});
