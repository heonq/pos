import { FormGeneratorInterface } from '../src/interfaces/utilInterfaces';
import formatter from './formatter';

const FormGenerator: FormGeneratorInterface = {
  generateProduct() {
    return {
      name: '',
      price: 0,
      barcode: '',
      category: 0,
      display: true,
      number: 0,
      salesQuantity: 0,
    };
  },
  generateCategory() {
    return { name: '', display: true, number: 0 };
  },

  generateCashCheck() {
    return {
      time: formatter.formatTime(new Date()),
      pettyCash: 0,
      cashSalesAmount: 0,
      currency: {
        1000: 0,
        5000: 0,
        10000: 0,
        50000: 0,
      },
      countedAmount: 0,
      expectedAmount: 0,
      correctBoolean: false,
    };
  },

  generatePaymentInfo(chargeAmount = 0, totalAmount = 0) {
    return {
      method: '',
      discountType: 'percentage',
      totalAmount,
      discountAmount: 0,
      discountValue: 0,
      chargeAmount,
      discountReason: '',
      ETCReason: '',
    };
  },
  generateSalesInfo(date = new Date(), products = [], chargeAmount = 0, method = '') {
    return {
      number: 0,
      products,
      chargeAmount,
      method,
      date: formatter.formatDate(date),
      time: formatter.formatTime(date),
      discount: false,
      discountValue: 0,
      refund: false,
      discountType: '',
      note: '',
    };
  },
};

export default FormGenerator;
