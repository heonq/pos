export type methodType = '카드결제' | '현금결제' | '기타결제' | '분할결제' | '계좌이체' | '';

export type infiniteQueryData<T> = {
  pageParams: any[];
  pages: T[][];
};
