import $ from '../../utils/index.js';

class modalController {
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
    $('#modal-container').classList.remove('show', 'big', 'small');
    $('#background').classList.remove('show');
  }
}

export default modalController;
