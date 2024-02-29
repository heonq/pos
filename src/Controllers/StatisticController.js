import $ from '../../utils/index.js';
import ModalController from '../core/modalController.js';
import statisticModalComponents from '../Views/modalComponents/statisticModalComponents.js';
import formatter from '../../utils/formatter.js';

class StatisticController extends ModalController {
  #salesData;

  constructor(salesData) {
    super();
    this.#salesData = salesData;
  }

  init() {
    this.#addRenderStatisticEvent();
  }

  #addRenderStatisticEvent() {
    $('#statistic-button').addEventListener(
      'click',
      this.#renderStatistic.bind(this, formatter.formatDate(new Date())),
    );
  }

  #renderStatistic() {
    this.showModal('big');
    $('#modal-container').innerHTML = statisticModalComponents.renderStatisticModalComponents();
    this.#plusStatisticRow();
    this.#addPlusStatisticRowEvent();
    this.#addDeleteStatisticEvent();
  }

  #renderDateSelect() {
    const rows = Array.from($('#statistic-row-container').querySelectorAll('.statistic-row'));
    const dates = this.#salesData.getDateWithSales();
    const statistic = this.#salesData.getStatistic(dates[0]);
    flatpickr(rows[rows.length - 1].querySelector('.statistic-date-select'), {
      defaultDate: dates[0],
      enable: dates,
      locale: 'ko',
    });

    rows[rows.length - 1].addEventListener('change', (e) => this.#searchBySelect(e.target));
    this.#renderStatisticContent(rows[rows.length - 1], statistic);
  }

  #addPlusStatisticRowEvent() {
    $('#plus-statistic-row-button').addEventListener('click', this.#plusStatisticRow.bind(this));
  }

  #plusStatisticRow() {
    $('#statistic-row-container').insertAdjacentHTML('beforeend', statisticModalComponents.renderStatisticRow());
    this.#renderDateSelect();
  }

  #renderStatisticContent(row, statistic) {
    const targetRow = row;
    targetRow.querySelector('.statistic-content').innerHTML = statisticModalComponents.renderStatistic(statistic);
  }

  #searchBySelect(target) {
    const row = target.closest('.statistic-row');
    const dateText = target.value;
    const statistic = this.#salesData.getStatistic(dateText);
    this.#renderStatisticContent(row, statistic);
  }

  #addDeleteStatisticEvent() {
    $('#statistic-row-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('statistic-delete-button')) this.#deleteStatistic(e);
    });
  }

  #deleteStatistic(e) {
    const targetNode = e.target.closest('.statistic-row');
    targetNode.parentNode.removeChild(targetNode);
  }
}

export default StatisticController;
