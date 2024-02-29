const VALUES = Object.freeze({
  discountType: { percentage: '%', amount: '원' },
  paymentMethods: ['카드결제', '현금결제', '계좌이체', '기타결제'],
  inputKeys: ['name', 'price', 'barcode'],
  selectKeys: ['category', 'display'],
  display: { true: true, false: false, default: 'default' },
  methods: ['카드결제', '현금결제', '계좌이체'],
});

export default VALUES;
