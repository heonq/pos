import $ from '../../utils/index.js';
import ModalController from '../core/modalController';
import statisticModalComponents from '../Views/modalComponents/statisticModalComponents';
import formatter from '../../utils/formatter';
import VALUES from '../../constants/values';
import { SalesDataInterface } from '../interfaces/ModelInterfaces';
import flatpickr from 'flatpickr';
import { Statistic } from '../interfaces/DataInterfaces';

class StatisticController extends ModalController {
  #salesData;

  constructor(salesData: SalesDataInterface) {
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

  #renderStatisticRow(dates: string[], statistics: Statistic[], i: number) {
    $('#statistic-body').insertAdjacentHTML(
      'beforeend',
      statisticModalComponents.renderStatisticRow(),
    );
    const rows = $('#statistic-body').querySelectorAll('tr');
    this.#addSelectDateEvent(rows[rows.length - 1]);
    this.#renderDateSelect(rows[rows.length - 1], dates, i);
    this.#renderStatisticContent(rows[rows.length - 1], statistics[i]);
  }

  #renderDateSelect(row: HTMLTableRowElement, dates: string[], index: number) {
    const dateInput = row.querySelector('.statistic-date-select') as HTMLInputElement;
    flatpickr(dateInput, {
      defaultDate: dates[index],
      enable: dates,
      locale: 'ko',
    });
  }

  #renderStatisticContent(row: HTMLTableRowElement, statistic: Statistic) {
    const tds = row.querySelectorAll('.statistic') as NodeListOf<HTMLTableCellElement>;
    tds.forEach((td, index) => {
      td.innerText = formatter.formatNumber(statistic[VALUES.statisticKeys[index]]);
    });
  }

  #addSelectDateEvent(row: HTMLTableRowElement) {
    row.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains('statistic-date-select')) {
        this.#renderStatisticBySelectedDate(target);
      }
    });
  }

  #renderStatisticBySelectedDate(target: HTMLInputElement) {
    const row = target.closest('.statistic-row') as HTMLTableRowElement;
    const dateText = target.value;
    const statistic = this.#salesData.getStatistic(dateText);
    this.#renderStatisticContent(row, statistic);
  }
}

export default StatisticController;
