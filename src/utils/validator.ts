import { ISplitPayment } from '../Interfaces/DataInterfaces';
import { IValidator } from '../Interfaces/utilInterfaces';

const validator: IValidator = {
  validateSplitPayment({ price, method }: ISplitPayment, chargedAmount: number) {
    if (price.reduce((totalAmount, amount) => totalAmount + amount, 0) !== chargedAmount) return false;
    if (!method.every((m) => m !== '')) return false;
    return true;
  },
};

export default validator;
