import { atom } from 'recoil';
import { IShoppingCartProduct } from './Interfaces/DataInterfaces';

export const viewModeAtom = atom({
  key: 'viewMode',
  default: 'category',
});

export const shoppingCartAtom = atom<IShoppingCartProduct[]>({
  key: 'shoppingCart',
  default: [],
});
