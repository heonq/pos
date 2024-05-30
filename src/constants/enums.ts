export enum PAYMENT_METHODS {
  Card = '카드결제',
  Cash = '현금결제',
  Other = '기타결제',
  Split = '분할결제',
  Transfer = '계좌이체',
  Discount = '할인적용',
}

export enum DISCOUNT_TYPE {
  'percentage' = 'percentage',
  'amount' = 'amount',
}

export enum ERROR_MESSAGES {
  trimName = '양 끝을 공백으로 설정할 수 없습니다.',
  blankName = '이름은 공백으로 설정할 수 없습니다.',
  duplicatedName = '중복된 이름이 존재합니다. 상품명 : ',
  duplicatedBarcode = '중복된 바코드가 존재합니다. 상품명 : ',
  shouldBeInt = '가격은 0 이상의 자연수여야 합니다.',
  cantDelete = '판매내역이 존재하는 상품은 삭제할 수 없습니다.',
  selectProduct = '상품을 선택해주세요.',
}

export enum CONFIRM_MESSAGES {
  changeSelectedDisplay = '선택한 상품의 전시 상태를 변경하시겠습니까?',
  changeSelectedCategory = '선택한 상품의 카테고리를 변경하시겠습니까?',
  deleteSelectedProduct = '선택한 상품을 삭제하시겠습니까?',
}

export enum PRODUCT_MANAGEMENT_OPTIONS {
  show = 'show',
  hide = 'hide',
  changeCategory = 'changeCategory',
  delete = 'delete',
}
