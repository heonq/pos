import ProductData from '../src/Models/ProductData';
import { makeProducts, makeCategories } from './utilForTest';

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

const productNames = ['상품1', '상품2', '상품3', '상품4'];
const productCategoryNumbers = [4, 3, 2, 1];
const productDisplay = [true, true, true, false];
const products = makeProducts(productNames, productCategoryNumbers, productDisplay);

const categoryNames = ['카테고리없음', '카테고리1', '카테고리2', '카테고리3'];
const categoryNumbers = [1, 2, 3, 4];
const categoryDisplay = [true, true, false, true];
const categories = makeCategories(categoryNames, categoryNumbers, categoryDisplay);

describe('productData 모듈 단위 테스트', () => {
  beforeEach(() => {
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockGetItem.mockReturnValueOnce(JSON.stringify(products));
    mockGetItem.mockReturnValueOnce(JSON.stringify(categories));
  });

  test('getCategoriesInOrder 메서드 테스트', () => {
    const productData = new ProductData();
    expect(productData.getCategoriesInOrder()).toEqual(['카테고리없음', '카테고리1', '카테고리3']);
  });

  test('getCategoriesGotProduct 메서드 테스트', () => {
    const productData = new ProductData();

    expect(productData.getCategoriesGotProduct()).toEqual(['카테고리1', '카테고리3']);
  });

  test('getProductsInOrder 메서드 테스트', () => {
    const productData = new ProductData();
    const result = [
      [{ category: 2, display: true, name: '상품3' }],
      [{ category: 4, display: true, name: '상품1' }],
    ];
    expect(productData.getProductsInOrder()).toEqual(result);
  });
});
