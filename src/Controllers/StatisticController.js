import $ from '../../utils/index.js';
import ModalController from '../core/modalController.js';
import statisticModalComponents from '../Views/modalComponents/statisticModalComponents.js';
import formatter from '../../utils/formatter.js';
import VALUES from '../../constants/values.js';

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
    $('#statistic-button').addEventListener('click', this.#renderStatisticModal.bind(this));
  }

  #renderStatisticModal() {
    this.showModal('midium');
    $('#modal-container').innerHTML = statisticModalComponents.renderStatisticModalComponents();
    this.#addPlusStatisticRowEvent();
    this.#renderStatistics();
    this.addCloseButtonEvent();
  }

  #addPlusStatisticRowEvent() {
    $('#plus-statistic-row-button').addEventListener('click', this.#renderStatistics.bind(this));
  }

  #renderStatistics() {
    const dates = this.#salesData.getDateWithSales();
    const statistics = dates.map((date) => this.#salesData.getStatistic(date));
    const renderedRows = Array.from($('#statistic-body').querySelectorAll('tr'));
    for (let i = renderedRows.length; i < renderedRows.length + VALUES.statisticPlusCount; i += 1) {
      if (statistics.length <= i) {
        $('#plus-statistic-row-button').classList.add('hide');
        break;
      }
      this.#renderStatisticRow(dates, statistics, i);
    }
    if (statistics.length <= $('#statistic-body').querySelectorAll('tr').length)
      $('#plus-statistic-row-button').classList.add('hide');
  }

  #renderStatisticRow(dates, statistics, i) {
    $('#statistic-body').insertAdjacentHTML('beforeend', statisticModalComponents.renderStatisticRow());
    const rows = $('#statistic-body').querySelectorAll('tr');
    this.#addSelectDateEvent(rows[rows.length - 1]);
    this.#renderDateSelect(rows[rows.length - 1], dates, i);
    this.#renderStatisticContent(rows[rows.length - 1], statistics[i]);
  }

  #renderDateSelect(row, dates, index) {
    flatpickr(row.querySelector('.statistic-date-select'), {
      defaultDate: dates[index],
      enable: dates,
      locale: 'ko',
    });
  }

  #renderStatisticContent(row, statistic) {
    const tds = row.querySelectorAll('.statistic');
    for (let i = 0; i < VALUES.statisticKeys.length; i += 1) {
      tds[i].innerText = formatter.formatNumber(statistic[VALUES.statisticKeys[i]]);
    }
  }

  #addSelectDateEvent(row) {
    row.addEventListener('change', (e) => {
      if (e.target.classList.contains('statistic-date-select')) {
        this.#renderStatisticBySelectedDate(e.target);
      }
    });
  }

  #renderStatisticBySelectedDate(target) {
    const row = target.closest('.statistic-row');
    const dateText = target.value;
    const statistic = this.#salesData.getStatistic(dateText);
    this.#renderStatisticContent(row, statistic);
  }
}

export default StatisticController;
