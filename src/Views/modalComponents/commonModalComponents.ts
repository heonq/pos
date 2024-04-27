import { CommonModalComponentsInterface } from '../../interfaces/ViewInterfaces';

const commonModalComponents: CommonModalComponentsInterface = {
  renderSubmitAndCancelButtons(modalType) {
    return `<div id="submit-buttons">
        <button class="submit-button" id="${modalType}-submit" disabled>확인</button><button class="cancel-button" id="${modalType}-cancel">취소</button>
        </div>`;
  },
};

export default commonModalComponents;
