import { cashCheckHistory, categories, products, salesData, dates, multipleSalesHistory } from './mockData';
import { productsAndCategoryApi } from '../apis/productsAndCategory';
import { jest } from '@storybook/jest';
import { historyApi } from '../apis/history';

export const getProductsAndCategoriesMock = () => {
  productsAndCategoryApi.getProducts = jest.fn(() => Promise.resolve(products));
  productsAndCategoryApi.getCategories = jest.fn(() => Promise.resolve(categories));
};

export const addProductAndCategoryMock = () => {
  productsAndCategoryApi.setData = jest.fn(() => Promise.resolve());
};

export const manageProductsAndCategoriesMock = () => {
  productsAndCategoryApi.updateChangedData = jest.fn(() => Promise.resolve());
  productsAndCategoryApi.deleteData = jest.fn(() => Promise.resolve());
};

export const salesHistoryMock = () => {
  historyApi.getSalesHistory = jest.fn(() => Promise.resolve(salesData));
  historyApi.getSalesDate = jest.fn(() => Promise.resolve(dates));
  historyApi.updateSalesHistory = jest.fn(() => Promise.resolve());
  historyApi.setSalesHistory = jest.fn(() => Promise.resolve());
  historyApi.setSalesDate = jest.fn(() => Promise.resolve());
  historyApi.updateSalesQuantity = jest.fn(() => Promise.resolve());
};

export const salesStatisticMock = () => {
  historyApi.createSalesStatisticDoc = jest.fn(() => Promise.resolve());
  historyApi.getMultipleSalesHistory = jest.fn(() => Promise.resolve(multipleSalesHistory));
};

export const cashCheckHistoryMock = () => {
  historyApi.getCashCheckHistory = jest.fn(() => Promise.resolve(cashCheckHistory));
  historyApi.getCashCheckDate = jest.fn(() => Promise.resolve(dates));
  historyApi.setCashCheckDate = jest.fn(() => Promise.resolve());
  historyApi.setCashCheckHistory = jest.fn(() => Promise.resolve());
};
