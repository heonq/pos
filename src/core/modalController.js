import $ from '../../utils/index.js';

class ModalController {
  addSubmitButtonEvent(submitId, callback) {
    $(`#${submitId}`).addEventListener('click', () => {
      callback();
    });
  }

  addCancelButtonEvent() {
    $('.cancel-button').addEventListener('click', this.hideModal.bind(this));
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
    $(`.submit-button`).classList.add('submitable');
    $(`.submit-button`).disabled = false;
  }

  disableSubmitButton() {
    $(`.submit-button`).classList.remove('submitable');
    $(`.submit-button`).disabled = true;
  }

  addRerenderClassName() {
    $('.submit-button').classList.add('rerender');
  }
}

export default ModalController;
