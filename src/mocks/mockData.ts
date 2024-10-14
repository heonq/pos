import { ISalesHistory } from '../Interfaces/DataInterfaces';
import formatter from '../utils/formatter';

export const categories = [
  {
    name: '카테고리없음',
    number: 1,
    display: true,
  },
  {
    name: '카테고리1',
    number: 2,
    display: true,
  },
];

export const products = [
  {
    name: 'product 1',
    number: 1,
    price: 50000,
    category: 1,
    display: true,
    barcode: '',
    salesQuantity: 1,
  },
  {
    name: 'product 2',
    number: 2,
    price: 50000,
    category: 2,
    display: true,
    barcode: '',
    salesQuantity: 1,
  },
];

export const shoppingCartProducts = [
  {
    number: 1,
    name: 'product 1',
    price: 50000,
    quantity: 1,
  },
  {
    number: 2,
    name: 'product 2',
    price: 50000,
    quantity: 1,
  },
];

export const dates = Array.from({ length: 50 }, (_, index) => {
  const date = new Date();
  date.setDate(1 + index - 30);
  return formatter.formatDate(date);
});

export const salesData = [
  {
    chargedAmount: 50000,
    date: formatter.formatDate(new Date()),
    discount: false,
    discountAmount: 0,
    discountType: '',
    discountValue: 0,
    method: '카드결제',
    note: '',
    number: 1,
    products: [
      {
        name: 'product 1',
        number: 1,
        price: 50000,
        quantity: 1,
      },
    ],
    refund: false,
    time: '10:00:00',
    totalAmount: 50000,
  },
  {
    chargedAmount: 50000,
    date: formatter.formatDate(new Date()),
    discount: false,
    discountAmount: 0,
    discountType: '',
    discountValue: 0,
    method: '카드결제',
    note: '',
    number: 1,
    products: [
      {
        name: 'product 1',
        number: 1,
        price: 50000,
        quantity: 1,
      },
      {
        name: 'product 2',
        number: 2,
        price: 50000,
        quantity: 1,
      },
    ],
    refund: false,
    time: '10:01:00',
    totalAmount: 100000,
  },
] as ISalesHistory[];

export const cashCheckHistory = [
  {
    1000: 0,
    5000: 0,
    10000: 0,
    50000: 1,
    cashSalesAmount: 0,
    correct: true,
    countedAmount: 50000,
    date: formatter.formatDate(new Date()),
    expectedAmount: 50000,
    number: 1,
    reserveCash: 50000,
    time: '10:00:00',
  },
];

export const multipleSalesHistory = dates.map((date) => {
  return [
    {
      number: 1,
      products: [
        {
          name: 'product 1',
          number: 1,
          price: 50000,
          quantity: 1,
        },
      ],
      method: '카드결제',
      discountType: '',
      totalAmount: 50000,
      discount: false,
      discountAmount: 0,
      discountValue: 0,
      chargedAmount: 50000,
      note: '',
      date,
      time: '10:00:00',
      refund: false,
    },
    {
      number: 1,
      products: [
        {
          name: 'product 1',
          number: 1,
          price: 50000,
          quantity: 1,
        },
        {
          name: 'product 2',
          number: 2,
          price: 50000,
          quantity: 1,
        },
      ],
      method: '카드결제',
      discountType: '',
      totalAmount: 100000,
      discount: false,
      discountAmount: 0,
      discountValue: 0,
      chargedAmount: 50000,
      note: '',
      date,
      time: '10:01:00',
      refund: false,
    },
  ];
}) as ISalesHistory[][];
