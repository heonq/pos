import validator from '../utils/validator';

describe('validator 테스트', () => {
  beforeAll(() => {
    global.alert = jest.fn();
  });

  test('validatePercentage 테스트', () => {
    const invalidDiscountPercentage = [-10, 5.5, 105];
    const validDiscountPercentage = 50;

    invalidDiscountPercentage.forEach((percentage) =>
      expect(validator.validatePercentage(percentage)).toBe(false),
    );

    expect(validator.validatePercentage(validDiscountPercentage)).toBe(true);
  });
  test('validateAmount 테스트', () => {
    const totalAmount = 50000;
    const invalidDiscountAmount = [-500, 505.5, 50001];
    const validDiscountAmount = 5000;

    invalidDiscountAmount.forEach((discountAmount) =>
      expect(validator.validateAmount(discountAmount, totalAmount)).toBe(false),
    );

    expect(validator.validateAmount(validDiscountAmount, totalAmount));
  });

  test('validateSplitPayment 테스트', () => {
    const invalidAmountsArray = [
      [5000, 5001],
      [10005, -5],
      [5000.5, 4999.5],
    ];
    const validAmounts = [6000, 4000];
    const totalAmount = 10000;

    invalidAmountsArray.forEach((amountArray) =>
      expect(validator.validateSplitPayment(amountArray, totalAmount)).toBe(false),
    );

    expect(validator.validateSplitPayment(validAmounts, totalAmount)).toBe(true);
  });

  test('validatePaymentMethod 테스트', () => {
    expect(validator.validatePaymentMethod('')).toBe(false);
  });

  test('validateBarcodes 테스트', () => {
    const products = [
      {
        name: '상품1',
        price: 0,
        barcode: '1',
        category: 1,
        display: true,
        number: 1,
        salesQuantity: 0,
      },
      {
        name: '상품2',
        price: 0,
        barcode: '1',
        category: 1,
        display: true,
        number: 2,
        salesQuantity: 0,
      },
    ];

    expect(validator.validateBarcodes(products)).toBe(false);
  });

  test('validatePrice 테스트', () => {
    const products = [
      {
        name: '상품1',
        price: -50,
        barcode: '1',
        category: 1,
        display: true,
        number: 1,
        salesQuantity: 0,
      },
      {
        name: '상품2',
        price: 0,
        barcode: '1',
        category: 1,
        display: true,
        number: 2,
        salesQuantity: 0,
      },
    ];

    expect(validator.validatePrice(products)).toBe(false);
  });

  test('validateInteger 테스트', () => {
    const invalidValues = [-50, 5.5];
    invalidValues.forEach((invalidValue) =>
      expect(validator.validateInteger(invalidValue)).toBe(false),
    );
    expect(validator.validateInteger(1)).toBe(true);
  });

  test('validateSalesQuantity 테스트', () => {
    expect(validator.validateSalesQuantity(1)).toBe(false);
    expect(validator.validateSalesQuantity(0)).toBe(true);
  });

  test('validateSelectedRows 테스트', () => {
    expect(validator.validateSelectedRows(0)).toBe(false);
    expect(validator.validateSelectedRows(1)).toBe(true);
  });

  test('validateDuplicatedNames 테스트', () => {
    expect(validator.validateDuplicatedNames(['상품1', '상품1'])).toBe(false);
    expect(validator.validateDuplicatedNames(['상품1', '상품2'])).toBe(true);
  });

  test('validateBlankNames 테스트', () => {
    const invalidNames = [[''], [' '], ['  ']];

    invalidNames.forEach((name) => expect(validator.validateBlankNames(name)).toBe(false));
    expect(validator.validateBlankNames(['상품1'])).toBe(true);
  });

  test('validateBlankNames 테스트', () => {
    const invalidNames = [[' 상품1'], ['상품1 '], [' 상품1 ']];

    invalidNames.forEach((name) => expect(validator.validateStringTrim(name)).toBe(false));
    expect(validator.validateStringTrim(['상품 1'])).toBe(true);
  });

  test('validateCategoryDelete 테스트', () => {
    const categoryNumber = [1, 2];

    const product = [
      {
        name: '상품1',
        price: 0,
        barcode: '1',
        category: 2,
        display: true,
        number: 1,
        salesQuantity: 0,
      },
    ];

    categoryNumber.forEach((number) =>
      expect(validator.validateCategoryDelete(number, product)).toBe(false),
    );

    expect(validator.validateCategoryDelete(3, product)).toBe(true);
  });

  test('validateRefund 테스트', () => {
    global.confirm = jest.fn();
    expect(validator.validateRefund('true')).toBe(false);
  });
});
