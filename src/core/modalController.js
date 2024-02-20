import $ from '../../utils/index.js';

class ModalController {
  addSubmitButtonEvent(submitClassName, callback) {
    $('#submit-buttons').addEventListener('click', (e) => {
      if (e.target.classList.contains(submitClassName)) {
        callback();
      }
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

  enableSubmitButton() {
    $('#submit').classList.add('submitable');
    $('#submit').disabled = false;
  }

  disableSubmitButton() {
    $('#submit').classList.remove('submitable');
    $('#submit').disalbed = true;
  }
}

export default ModalController;
