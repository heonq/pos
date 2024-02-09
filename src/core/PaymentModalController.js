import ModalController from './ModalController.js';
import $ from '../../utils/index.js';

class PaymentModalController extends ModalController {
  renderSelectedMethod(shoppingCartData) {
    const buttons = $('#payment-method-box').querySelectorAll('button');
    const { method } = shoppingCartData.getPaymentInfo();
    buttons.forEach((button) => {
      if (button.id === 'discount') return;
      button.classList.remove('selected');
      if (button.innerText === method) button.classList.add('selected');
    });
  }
}

export default PaymentModalController;
