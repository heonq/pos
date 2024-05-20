import { atom, selector } from 'recoil';
import { IPaymentInfo, ISalesHistory, IShoppingCartProduct } from './Interfaces/DataInterfaces';
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
  set: ({ set }, newValue) => {
    set(paymentInfoAtom, newValue);
  },
});

export const salesNumberState = atom({
  key: 'salesNumberState',
  default: 0,
});

export const salesHistoryState = atom<ISalesHistory>({
  key: 'salesHistory',
  default: FormGenerator.generateSalesHistory(),
});

export const salesHistorySelector = selector<ISalesHistory>({
  key: 'salesHistorySelector',
  get: ({ get }) => {
    const products = get(shoppingCartSelector);
    const paymentInfo = get(paymentInfoSelector);
    const salesNumber = get(salesNumberState) + 1;
    const salesHistory = get(salesHistoryState);
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
    set(salesHistoryState, newValue);
  },
});