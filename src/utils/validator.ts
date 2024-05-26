import { ISplitPayment } from '../Interfaces/DataInterfaces';
import { IValidator } from '../Interfaces/utilInterfaces';

const validator: IValidator = {
  validateSplitPayment({ price, method }: ISplitPayment, chargedAmount: number) {
    if (price.reduce((totalAmount, amount) => totalAmount + amount, 0) !== chargedAmount) return false;
    if (!method.every((m) => m !== '')) return false;
    return true;
  },

  validateDuplicatedNames(names) {
    const duplicatedNames = [...new Set(names.filter((name) => names.lastIndexOf(name) !== names.indexOf(name)))];
    return duplicatedNames;
  },

  validateProductName(name) {
    return this.validateBlankName(name) && this.validateNameTrim(name);
  },

  validateBlankName(name) {
    const regex = /^\s*$/;
    return !regex.test(name);
  },

  validateNameTrim(name) {
    return name === name.trim();
  },

  validateBarcodes(barcodes) {
    const duplicatedBarcodes = barcodes
      .filter((barcode) => barcodes.lastIndexOf(barcode) !== barcodes.indexOf(barcode))
      .filter((barcode) => barcode !== '');
    return duplicatedBarcodes;
  },

  validateInteger(number) {
    return number >= 0 && Number.isInteger(number);
  },
};

export default validator;
