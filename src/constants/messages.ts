export enum ERROR_MESSAGES {
  trimName = '양 끝을 공백으로 설정할 수 없습니다.',
  blankName = '이름은 공백으로 설정할 수 없습니다.',
  duplicatedName = '중복된 이름이 존재합니다. 상품명 : ',
  duplicatedBarcode = '중복된 바코드가 존재합니다. 상품명 : ',
  shouldBeInt = '가격은 0 이상의 자연수여야 합니다.',
  cantDeleteProduct = '판매내역이 존재하는 상품은 삭제할 수 없습니다.',
  selectProduct = '상품을 선택해주세요.',
  cantDeleteCategory = '상품이 존재하는 카테고리는 삭제할 수 없습니다.',
  SelectCategory = '카테고리를 선택해주세요.',
  cantDeleteDefaultCategory = '기본 카테고리는 삭제할 수 없습니다.',
  refundExist = '이미 환불된 결제 내역입니다.',
}

export enum CONFIRM_MESSAGES {
  changeSelectedProductDisplay = '선택한 상품의 전시 상태를 변경하시겠습니까?',
  changeSelectedProductCategory = '선택한 상품의 카테고리를 변경하시겠습니까?',
  deleteSelectedProduct = '선택한 상품을 삭제하시겠습니까?',
  deleteSelectedCategory = '선택한 카테고리를 삭제하시겠습니까?',
  changeSelectedCategoryDisplay = '선택한 카테고리의 전시 상태를 변경하시겠습니까?',
  refundSalesHistory = '결제 내역을 환불하시겠습니까?',
}
