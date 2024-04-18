import formatter from '../utils/formatter';

describe('formatter 단위 테스트', () => {
  test('formatNumber 메서드 테스트', () => {
    const inputNumbers = [1000, 1000000, 1000000000];
    const outputNumbers = ['1,000', '1,000,000', '1,000,000,000'];

    inputNumbers.forEach((inputNumber, index) =>
      expect(formatter.formatNumber(inputNumber)).toBe(outputNumbers[index]),
    );
  });
  test('formatDataSetToText,formatTextToDataSet 메서드 테스트', () => {
    const dataSet = 'input_text';
    const text = 'input text';

    expect(formatter.formatDataSetToText(dataSet)).toBe(text);
    expect(formatter.formatTextToDataSet(text)).toBe(dataSet);
  });

  test('formatDate 메서드 테스트', () => {
    const testDate = new Date('january 1,2024 00:00:00');
    const output = '2024-01-01';

    expect(formatter.formatDate(testDate)).toBe(output);
  });

  test('formatTime 메서드 테스트', () => {
    const testDate = new Date('january 1,2024 00:00:00');
    const output = '00:00:00';

    expect(formatter.formatTime(testDate)).toBe(output);
  });

  test('formatZero 메서드 테스트', () => {
    const testInput = '1';
    const output = '01';

    expect(formatter.formatZero(testInput)).toBe(output);
  });
});
