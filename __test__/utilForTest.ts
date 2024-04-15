type Product = {
  name: string;
  category: number;
  display: boolean;
};

type Products = {
  [key: number]: Product;
};

type Category = {
  name: string;
  number: number;
  display: boolean;
};

type Categories = {
  [key: number]: Category;
};

type MakeProducts = (names: string[], categories: number[], display: boolean[]) => Products;
type MakeCategories = (names: string[], numbers: number[], display: boolean[]) => Categories;

export const makeProducts: MakeProducts = (names, categories, display) => {
  return Object.fromEntries(
    names.map((name, index) => {
      return [index + 1, { name, category: categories[index], display: display[index] }];
    }),
  );
};

export const makeCategories: MakeCategories = (names, numbers, display) => {
  return Object.fromEntries(
    names.map((name, index) => {
      return [index + 1, { name, number: numbers[index], display: display[index] }];
    }),
  );
};
