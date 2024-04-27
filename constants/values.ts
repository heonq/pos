import { PaymentMethod } from '../src/Types/Types';

interface VALUES {
  readonly discountType: { [key: string]: string };
  readonly paymentMethods: string[];
  readonly inputKeys: string[];
  readonly selectKeys: string[];
  readonly display: { [key: string]: boolean | string };
  readonly methods: PaymentMethod[];
  readonly currencyUnits: number[];
  readonly statisticKeys: string[];
  readonly statisticPlusCount: number;
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
