import { Products, Categories } from '../src/interfaces/DataInterfaces';

type MakeProducts = (
  names: string[],
  categories: number[],
  display: boolean[],
  startNumber?: number,
) => Products;

type MakeCategories = (
  names: string[],
  numbers: number[],
  display: boolean[],
  startNumber?: number,
) => Categories;

export const makeProducts: MakeProducts = (names, categories, display, startNumber = 1) => {
  return Object.fromEntries(
    names.map((name, index) => {
      return [
        index + startNumber,
        {
          name,
          price: 0,
          barcode: '',
          category: categories[index],
          display: display[index],
          number: index + startNumber,
          salesQuantity: 0,
        },
      ];
    }),
  );
};

export const makeCategories: MakeCategories = (names, numbers, display, startNumber = 1) => {
  return Object.fromEntries(
    names.map((name, index) => {
      return [index + startNumber, { name, number: numbers[index], display: display[index] }];
    }),
  );
};
