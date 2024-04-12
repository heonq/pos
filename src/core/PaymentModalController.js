import ModalController from './modalController.js';
import $ from '../../utils/index.js';

class PaymentModalController extends ModalController {
  renderSelectedMethod(salesData) {
    const buttons = $('#payment-method-box').querySelectorAll('button');
    const { method } = salesData.getPaymentInfo();
    buttons.forEach((button) => {
      if (button.id === 'discount') return;
      button.classList.remove('selected');
      if (button.innerText === method) button.classList.add('selected');
    });
  }
}

export default PaymentModalController;
