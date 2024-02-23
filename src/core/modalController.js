import $ from '../../utils/index.js';

class ModalController {
  addSubmitButtonEvent(submitId, callback) {
    $(`#${submitId}`).addEventListener('click', () => {
      callback();
    });
  }

  showModal(modalSize) {
    $('#modal-container').classList.add('show', modalSize);
    $('#background').classList.add('show');
  }

  hideModal() {
    $('#modal-container').className = '';
    $('#background').className = '';
  }

  enableSubmitButton(submitId) {
    $(`#${submitId}`).classList.add('submitable');
    $(`#${submitId}`).disabled = false;
  }

  disableSubmitButton(submitId) {
    $(`#${submitId}`).classList.remove('submitable');
    $(`#${submitId}`).disalbed = true;
  }
}

export default ModalController;
