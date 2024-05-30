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
    const { discountAmount } = paymentInfo;
    return {
      ...paymentInfo,
      totalAmount,
      chargedAmount: totalAmount - discountAmount,
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

export const productMenuDisplayAtom = atom({
  key: 'productMenuDisplay',
  default: false,
});

export const productMenuDisplaySelector = selector({
  key: 'productMenuDisplaySelector',
  get: ({ get }) => {
    return get(productMenuDisplayAtom);
  },
  set: ({ set, reset }, newValue) => {
    set(productMenuDisplayAtom, newValue);
    reset(viewModeMenuDisplayAtom);
    reset(profileMenuDisplayAtom);
  },
});

export const viewModeMenuDisplayAtom = atom({
  key: 'viewModeMenuDisplay',
  default: false,
});

export const viewModeMenuDisplaySelector = selector({
  key: 'viewModeMenuDisplaySelector',
  get: ({ get }) => {
    return get(viewModeMenuDisplayAtom);
  },
  set: ({ set, reset }, newValue) => {
    set(viewModeMenuDisplayAtom, newValue);
    reset(productMenuDisplayAtom);
    reset(profileMenuDisplayAtom);
  },
});

export const profileMenuDisplayAtom = atom({
  key: 'profileMenuDisplay',
  default: false,
});

export const profileMenuDisplaySelector = selector({
  key: 'profileMenuDisplaySelector',
  get: ({ get }) => {
    return get(profileMenuDisplayAtom);
  },
  set: ({ set, reset }, newValue) => {
    set(profileMenuDisplayAtom, newValue);
    reset(productMenuDisplayAtom);
    reset(viewModeMenuDisplayAtom);
  },
});

export const headerMenusDisplaySelector = selector({
  key: 'headerMenusDisplay',
  get: ({ get }) => {
    return get(profileMenuDisplayAtom) || get(viewModeMenuDisplayAtom) || get(productMenuDisplayAtom);
  },
  set: ({ reset }) => {
    reset(profileMenuDisplayAtom);
    reset(viewModeMenuDisplayAtom);
    reset(productMenuDisplayAtom);
  },
});
