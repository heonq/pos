import $ from '../../utils/index.js';
import { PaymentInfo } from '../interfaces/DataInterfaces';
import ModalController from './modalController';

class PaymentModalController extends ModalController implements PaymentModalController {
  renderSelectedMethod(paymentInfo: PaymentInfo) {
    const buttons: HTMLElement[] = $('#payment-method-box').querySelectorAll('button');
    const { method } = paymentInfo;
    buttons.forEach((button) => {
      if (button.id === 'discount') return;
      button.classList.remove('selected');
      if (button.innerText === method) button.classList.add('selected');
    });
  }
}

export default PaymentModalController;
