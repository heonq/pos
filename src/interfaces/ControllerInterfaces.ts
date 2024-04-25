import { PaymentInfo } from './DataInterfaces';

export interface ModalControllerInterface {
  addSubmitButtonEvent(submitId: string, callback: Function): void;
  addCancelButtonEvent(): void;
  addCloseButtonEvent(): void;
  showModal(modalSize: string): void;
  hideModal(): void;
  enableSubmitButton(): void;
  disableSubmitButton(): void;
  addRerenderClassName(): void;
}

export interface PaymentModalController extends ModalControllerInterface {
  renderSelectedMethod(paymentInfo: PaymentInfo): void;
}
