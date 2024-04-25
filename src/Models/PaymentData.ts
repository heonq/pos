import store from '../../utils/store.js';
import { PaymentInfo, SplitPayment } from '../interfaces/DataInterfaces.js';
import { PaymentDataInterface } from '../interfaces/ModelInterfaces';
import { ShoppingCartProduct } from '../interfaces/DataInterfaces.js';
import { DiscountType, PaymentMethod } from '../Types/Types.js';

class PaymentData implements PaymentDataInterface {
  private paymentInfo: PaymentInfo = {
    method: '',
    discountType: 'percentage',
    totalAmount: 0,
    discountAmount: 0,
    discountValue: 0,
    chargeAmount: 0,
    discountReason: '',
    ETCReason: '',
  };

  private splitPayment: SplitPayment = {
    methods: [],
    amounts: [],
  };

  constructor() {
    this.getPaymentInfoFromStorage();
    this.initSplitPayment();
  }

  initPaymentInfo() {
    this.setDefaultPaymentInfo();
    this.setPaymentInfoToStorage();
  }

  getPaymentInfo(): PaymentInfo {
    this.getPaymentInfoFromStorage();
    return this.paymentInfo;
  }

  private setPaymentInfoToStorage() {
    store.setStorage('paymentInfo', this.paymentInfo);
  }

  private getPaymentInfoFromStorage() {
    this.setDefaultPaymentInfo();
    if (store.getStorage('paymentInfo')) this.paymentInfo = store.getStorage('paymentInfo');
  }

  private setDefaultPaymentInfo() {
    const shoppingCart: ShoppingCartProduct[] = store.getStorage('shoppingCart') ?? [];
    const totalAmount = shoppingCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    this.paymentInfo = {
      method: '',
      discountType: 'percentage',
      totalAmount,
      discountAmount: 0,
      discountValue: 0,
      chargeAmount: totalAmount,
      discountReason: '',
      ETCReason: '',
    };
  }

  updatePaymentMethod(method: PaymentMethod) {
    this.getPaymentInfoFromStorage();
    this.paymentInfo.method = method;
    this.setPaymentInfoToStorage();
  }

  updateDiscount(discountValue: number, discountReason: string) {
    this.updateDiscountValue(discountValue);
    this.paymentInfo.discountReason = discountReason;
    this.setPaymentInfoToStorage();
  }

  updateDiscountType(type: DiscountType) {
    this.setDefaultPaymentInfo();
    this.paymentInfo.discountType = type;
    this.setPaymentInfoToStorage();
  }

  updateDiscountValue(discountValue: number) {
    this.paymentInfo.discountValue = discountValue;
    this.paymentInfo.discountAmount = discountValue;
    if (this.paymentInfo.discountType === 'percentage')
      this.paymentInfo.discountAmount = Math.floor(
        discountValue * this.paymentInfo.totalAmount * 0.01,
      );
    this.paymentInfo.chargeAmount = this.paymentInfo.totalAmount - this.paymentInfo.discountAmount;
  }

  checkDiscountAmount(): boolean {
    return this.paymentInfo.discountAmount > 0;
  }

  checkDiscountType(): boolean {
    return this.paymentInfo.discountType === 'percentage';
  }

  saveSplitPayment(paymentMethod: string[] = [], amount: number[] = []) {
    this.splitPayment.methods = paymentMethod;
    this.splitPayment.amounts = amount.map(Number);
    store.setStorage('splitPayment', this.splitPayment);
  }

  setDefaultSplitPayment() {
    this.splitPayment = {
      methods: [],
      amounts: [],
    };
  }

  deactivateSplitPayment() {
    this.setDefaultSplitPayment();
    this.updatePaymentMethod('');
    store.setStorage('splitPayment', this.splitPayment);
  }

  initSplitPayment() {
    this.setDefaultSplitPayment();
    if (store.getStorage('splitPayment')) this.splitPayment = store.getStorage('splitPayment');
  }

  getSplitPayment(): SplitPayment {
    this.initSplitPayment();
    return this.splitPayment;
  }

  setETCReason(reason: string) {
    this.initPaymentInfo();
    this.updatePaymentMethod('기타결제');
    this.paymentInfo.ETCReason = reason;
    this.setPaymentInfoToStorage();
  }
}

export default PaymentData;
