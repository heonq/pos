import { SalesInfo } from '../interfaces/DataInterfaces';

export type PaymentMethod = '현금결제' | '카드결제' | '계좌이체' | '기타결제' | '분할결제' | '';
export type DiscountType = 'percentage' | 'amount' | '';
export type SalesHistory = SalesInfo[];
