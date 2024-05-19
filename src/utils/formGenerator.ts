import { IFormGenerator } from '../Interfaces/utilInterfaces';

const FormGenerator: IFormGenerator = {
  generatePaymentInfo() {
    return {
      method: '',
      discountType: '',
      totalAmount: 0,
      discountAmount: 0,
      discountValue: 0,
      chargedAmount: 0,
      note: '',
    };
  },
  generateSalesHistory() {
    return {
      number: 0,
      products: [],
      method: '',
      discountType: '',
      totalAmount: 0,
      discount: false,
      discountAmount: 0,
      discountValue: 0,
      chargedAmount: 0,
      note: '',
      date: '',
      time: '',
      refund: false,
    };
  },
};

export default FormGenerator;
