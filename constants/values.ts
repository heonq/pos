import { PaymentMethod } from '../src/Types/Types';

interface VALUES {
  discountType: { [key: string]: string };
  paymentMethods: PaymentMethod[];
  inputKeys: string[];
  selectKeys: string[];
  display: { [key: string]: boolean | string };
  methods: PaymentMethod[];
  currencyUnits: number[];
  statisticKeys: string[];
  statisticPlusCount: number;
}

const VALUES: VALUES = {
  discountType: { percentage: '%', amount: '원' },
  paymentMethods: ['카드결제', '현금결제', '계좌이체', '기타결제'],
  inputKeys: ['name', 'price', 'barcode'],
  selectKeys: ['category', 'display'],
  display: { true: true, false: false, default: 'default' },
  methods: ['카드결제', '현금결제', '계좌이체'],
  currencyUnits: [1000, 5000, 10000, 50000],
  statisticKeys: ['totalAmount', 'cardAmount', 'cashAmount', 'wireAmount'],
  statisticPlusCount: 50,
};

export default VALUES;
