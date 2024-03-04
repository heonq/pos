import HeaderController from './Controllers/HeaderController.js';
import ProductsController from './Controllers/ProductsController.js';
import ShoppingCartController from './Controllers/ShoppingCartController.js';
import DiscountController from './Controllers/DiscountController.js';
import SplitPaymentController from './Controllers/SplitPaymentController.js';
import SalesHistoryController from './Controllers/SalesHistoryController.js';
import ProductManagementController from './Controllers/ProductManagementController.js';
import ProductRegistrationController from './Controllers/ProductRegistrationController.js';
import CategoryManagementController from './Controllers/CategoryManagementController.js';
import CategoryRegistrationController from './Controllers/CategoryRegistrationController.js';
import StatisticController from './Controllers/StatisticController.js';
import ProductData from './Models/ProductData.js';
import SalesData from './Models/SalesData.js';
import ShoppingCartData from './Models/ShoppingCartData.js';
import CashCheckController from './Controllers/CashCheckController.js';
import CashCheckData from './Models/CashCheckData.js';

class App {
  #productData;

  #salesData;

  #shoppingCartData;

  #cashCheckData;

  constructor() {
    this.#productData = new ProductData();
    this.#shoppingCartData = new ShoppingCartData();
    this.#salesData = new SalesData(this.#shoppingCartData);
    this.#cashCheckData = new CashCheckData();
  }

  play() {
    new HeaderController().init();
    new ProductsController(this.#productData).init();
    new ShoppingCartController(this.#productData, this.#shoppingCartData, this.#salesData).init();
    new DiscountController(this.#shoppingCartData, this.#salesData).init();
    new SplitPaymentController(this.#shoppingCartData, this.#salesData).init();
    new SalesHistoryController(this.#productData, this.#salesData).init();
    new ProductManagementController(this.#productData).init();
    new ProductRegistrationController(this.#productData).init();
    new CategoryManagementController(this.#productData).init();
    new CategoryRegistrationController(this.#productData).init();
    new StatisticController(this.#salesData).init();
    new CashCheckController(this.#salesData, this.#cashCheckData).init();
  }
}

export default App;
