import HeaderController from './Controllers/HeaderController.js';
import ProductsController from './Controllers/ProductsController.ts';
import ShoppingCartController from './Controllers/ShoppingCartController.js';
import DiscountController from './Controllers/DiscountController.js';
import SplitPaymentController from './Controllers/SplitPaymentController.js';
import SalesHistoryController from './Controllers/SalesHistoryController.js';
import ProductManagementController from './Controllers/ProductManagementController.js';
import ProductRegistrationController from './Controllers/ProductRegistrationController.js';
import CategoryManagementController from './Controllers/CategoryManagementController.js';
import CategoryRegistrationController from './Controllers/CategoryRegistrationController.js';
import StatisticController from './Controllers/StatisticController.js';
import ProductData from './Models/ProductData.ts';
import SalesData from './Models/SalesData';
import ShoppingCartData from './Models/ShoppingCartData.ts';
import CashCheckController from './Controllers/CashCheckController.js';
import CashCheckData from './Models/CashCheckData';
import PaymentData from './Models/PaymentData';
import './resources.js';

class App {
  #productData;

  #salesData;

  #shoppingCartData;

  #cashCheckData;

  #paymentData;

  constructor() {
    this.#productData = new ProductData();
    this.#shoppingCartData = new ShoppingCartData();
    this.#salesData = new SalesData();
    this.#cashCheckData = new CashCheckData();
    this.#paymentData = new PaymentData();
  }

  play() {
    new HeaderController().init();
    new ProductsController(this.#productData).init();
    new ShoppingCartController(
      this.#productData,
      this.#shoppingCartData,
      this.#salesData,
      this.#paymentData,
    ).init();
    new DiscountController(this.#shoppingCartData, this.#salesData, this.#paymentData).init();
    new SplitPaymentController(this.#shoppingCartData, this.#paymentData).init();
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
