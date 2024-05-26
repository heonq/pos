export enum paymentMethodsEnum {
  Card = '카드결제',
  Cash = '현금결제',
  Other = '기타결제',
  Split = '분할결제',
  Transfer = '계좌이체',
  Discount = '할인적용',
}

export enum discountTypeEnum {
  'percentage' = 'percentage',
  'amount' = 'amount',
}

export enum MESSAGES {
  trimName = '양 끝을 공백으로 설정할 수 없습니다.',
  blankName = '이름은 공백으로 설정할 수 없습니다.',
  duplicatedName = '중복된 이름이 존재합니다. 상품명 : ',
  duplicatedBarcode = '중복된 바코드가 존재합니다. 상품명 : ',
  shouldBeInt = '가격은 0 이상의 자연수여야 합니다.',
}
