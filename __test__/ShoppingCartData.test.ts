import ShoppingCartData from '../src/Models/ShoppingCartData';
import { makeProducts } from './utilForTest';

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

const product = makeProducts(['상품1'], [1], [true])[1];

describe('ShoppingCartData 모듈 단위 테스트', () => {
  test('addToShoppingCart 메서드 테스트 = 장바구니에 새 상품이 추가될 때', () => {
    mockGetItem.mockReturnValueOnce(JSON.stringify([]));
    const shoppingCartData = new ShoppingCartData();

    shoppingCartData.addToShoppingCart(product);

    expect(shoppingCartData.getShoppingCartData()).toEqual([
      {
        name: '상품1',
        number: 1,
        price: 0,
        quantity: 1,
      },
    ]);
  });

  test('addToShoppingCart 메서드 테스트 = 장바구니에 존재하는 상품을 추가할 때', () => {
    const shoppingCart = [{ name: '상품1', number: 1, price: 0, quantity: 1 }];
    mockGetItem.mockReturnValueOnce(JSON.stringify(shoppingCart));
    const shoppingCartData = new ShoppingCartData();

    shoppingCartData.addToShoppingCart(product);
    expect(shoppingCartData.getShoppingCartData()).toEqual([
      {
        name: '상품1',
        number: 1,
        price: 0,
        quantity: 2,
      },
    ]);
  });

  test('getTotalAmount 메서드 테스트', () => {
    const shoppingCart = [
      { name: '상품1', number: 1, price: 50000, quantity: 2 },
      { name: '상품2', number: 2, price: 50000, quantity: 1 },
    ];
    mockGetItem.mockReturnValueOnce(JSON.stringify(shoppingCart));
    const shoppingCartData = new ShoppingCartData();

    expect(shoppingCartData.getTotalAmount()).toBe(150000);
  });

  test('plusQuantity 메서드 테스트', () => {
    const shoppingCart = [
      { name: '상품1', number: 1, price: 50000, quantity: 2 },
      { name: '상품2', number: 2, price: 50000, quantity: 1 },
    ];
    mockGetItem.mockReturnValueOnce(JSON.stringify(shoppingCart));
    const shoppingCartData = new ShoppingCartData();

    shoppingCartData.plusQuantity(2);
    expect(shoppingCartData.getShoppingCartData()).toEqual([
      { name: '상품1', number: 1, price: 50000, quantity: 2 },
      { name: '상품2', number: 2, price: 50000, quantity: 2 },
    ]);
  });

  test('minusQuantity 메서드 테스트', () => {
    const shoppingCart = [
      { name: '상품1', number: 1, price: 50000, quantity: 2 },
      { name: '상품2', number: 2, price: 50000, quantity: 1 },
    ];
    mockGetItem.mockReturnValueOnce(JSON.stringify(shoppingCart));
    const shoppingCartData = new ShoppingCartData();

    shoppingCartData.minusQuantity(2);
    expect(shoppingCartData.getShoppingCartData()).toEqual([
      { name: '상품1', number: 1, price: 50000, quantity: 2 },
    ]);
  });

  test('deleteFromCart 메서드 테스트', () => {
    const shoppingCart = [
      { name: '상품1', number: 1, price: 50000, quantity: 2 },
      { name: '상품2', number: 2, price: 50000, quantity: 1 },
    ];
    mockGetItem.mockReturnValueOnce(JSON.stringify(shoppingCart));
    const shoppingCartData = new ShoppingCartData();

    shoppingCartData.deleteFromCart(1);
    expect(shoppingCartData.getShoppingCartData()).toEqual([
      { name: '상품2', number: 2, price: 50000, quantity: 1 },
    ]);
  });

  test('initShoppingCart 메서드 테스트', () => {
    const shoppingCart = [
      { name: '상품1', number: 1, price: 50000, quantity: 2 },
      { name: '상품2', number: 2, price: 50000, quantity: 1 },
    ];
    mockGetItem.mockReturnValueOnce(JSON.stringify(shoppingCart));
    const shoppingCartData = new ShoppingCartData();

    shoppingCartData.initShoppingCart();
    expect(shoppingCartData.getShoppingCartData()).toEqual([]);
  });
});
