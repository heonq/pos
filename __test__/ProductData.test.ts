import ProductData from '../src/Models/ProductData';
import { makeCategories, makeProducts } from './utilForTest';
import { Products, Categories } from '../src/interfaces/DataInterfaces';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (args: string) => mockGetItem(args),
    setItem: (args: string) => mockSetItem(args),
    removeItem: (args: string) => mockRemoveItem(args),
  },
});

const mockGetProductsAndCategories = (products: Products, categories: Categories): void => {
  mockGetItem.mockReturnValueOnce(JSON.stringify(products));
  mockGetItem.mockReturnValueOnce(JSON.stringify(categories));
};

describe('productData 모듈 단위 테스트', () => {
  test('getCategoriesInOrder 메서드 테스트', () => {
    const productNames = ['상품1'];
    const productDisplay = [true];
    const productCategories = [1];
    const products = makeProducts(productNames, productCategories, productDisplay);

    const categoryNames = ['카테고리없음', '카테고리1', '카테고리2', '카테고리3'];
    const categoryDisplay = [true, true, false, true];
    const categoryNumbers = [1, 2, 3, 4];
    const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);

    mockGetProductsAndCategories(products, categories);
    const productData = new ProductData();

    expect(productData.getCategoriesInOrder()).toEqual(['카테고리없음', '카테고리1', '카테고리3']);
  });

  test('getCategoriesGotProduct 메서드 테스트', () => {
    const productNames = ['상품1', '상품2', '상품3', '상품4'];
    const productCategories = [4, 3, 4, 1];
    const productDisplay = [true, true, true, false];
    const products = makeProducts(productNames, productCategories, productDisplay);

    const categoryNames = ['카테고리없음', '카테고리1', '카테고리2', '카테고리3'];
    const categoryDisplay = [true, true, false, true];
    const categoryNumbers = [1, 2, 3, 4];
    const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);

    mockGetProductsAndCategories(products, categories);
    const productData = new ProductData();

    expect(productData.getCategoriesGotProduct()).toEqual(['카테고리3']);
  });

  test('getProductsInOrder 메서드 테스트', () => {
    const productNames = ['상품1', '상품2', '상품3', '상품4'];
    const productCategories = [2, 1, 2, 1];
    const productDisplay = [true, true, true, true];
    const products = makeProducts(productNames, productCategories, productDisplay);
    const result = [
      [products[2], products[4]],
      [products[1], products[3]],
    ];

    const categoryNames = ['카테고리없음', '카테고리1'];
    const categoryDisplay = [true, true];
    const categoryNumbers = [1, 2];
    const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);

    mockGetProductsAndCategories(products, categories);
    const productData = new ProductData();

    expect(productData.getProductsInOrder()).toEqual(result);
  });

  test('convertCategoryNumberToName,NameToNumber 메서드 테스트', () => {
    const products = {};

    const categoryNames = ['카테고리없음'];
    const categoryDisplay = [true];
    const categoryNumbers = [1];
    const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);

    mockGetProductsAndCategories(products, categories);
    const productData = new ProductData();

    expect(productData.convertCategoryNumberToName(1)).toBe('카테고리없음');
    expect(productData.convertCategoryNameToNumber('카테고리없음')).toBe(1);
  });

  test('deleteProducts,deleteCategories 메서드 테스트', () => {
    const productNames = ['상품1', '상품2'];
    const productCategories = [1, 2];
    const productDisplay = [true, true];
    const products = makeProducts(productNames, productCategories, productDisplay);

    const categoryNames = ['카테고리없음', '카테고리1'];
    const categoryDisplay = [true, true];
    const categoryNumbers = [1, 2];
    const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);

    const productResult = makeProducts(['상품2'], [2], [true], 2);
    const categoryResult = makeCategories(['카테고리1'], [2], [true], 2);

    mockGetProductsAndCategories(products, categories);
    const productData = new ProductData();

    productData.deleteProduct(1);
    productData.deleteCategory(1);

    expect(productData.getProducts()).toEqual(productResult);
    expect(productData.getCategories()).toEqual(categoryResult);
  });

  test('registerProduct,registerCategory 메서드 테스트', () => {
    const productNames = ['상품1', '상품2'];
    const productCategories = [1, 1];
    const productDisplay = [true, true];
    const products = makeProducts(productNames, productCategories, productDisplay);
    const newProduct = makeProducts(['상품3'], [1], [true], 3);
    const productsResult = { ...products, ...newProduct };

    const categoryNames = ['카테고리없음', '카테고리1'];
    const categoryDisplay = [true, true];
    const categoryNumbers = [1, 2];
    const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);
    const newCategory = makeCategories(['카테고리2'], [3], [true], 3);
    const categoriesResult = { ...categories, ...newCategory };

    mockGetProductsAndCategories(products, categories);
    const productData = new ProductData();
    productData.registerProduct(newProduct);
    productData.registerCategory(newCategory);

    expect(productData.getProducts()).toEqual(productsResult);
    expect(productData.getCategories()).toEqual(categoriesResult);
  });

  test('updateProduct,updateCategory 메서드 테스트', () => {
    const productNames = ['상품1', '상품2'];
    const productCategories = [1, 1];
    const productDisplay = [true, true];
    const products = makeProducts(productNames, productCategories, productDisplay);
    const editedProduct = makeProducts(['상품1수정'], [1], [true], 1);
    const productsResult = { ...products, ...editedProduct };

    const categoryNames = ['카테고리없음', '카테고리1'];
    const categoryDisplay = [true, true];
    const categoryNumbers = [1, 2];
    const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);
    const editedCategory = makeCategories(['카테고리없음 수정'], [3], [true], 1);
    const categoriesResult = { ...categories, ...editedCategory };

    mockGetItem.mockReturnValueOnce(JSON.stringify(products));
    mockGetItem.mockReturnValueOnce(JSON.stringify(categories));
    const productData = new ProductData();

    productData.updateProduct(1, editedProduct[1]);
    productData.updateCategory(1, editedCategory[1]);

    expect(productData.getProducts()).toEqual(productsResult);
    expect(productData.getCategories()).toEqual(categoriesResult);
  });
});
