import HeaderController from './Controllers/HeaderController';
import ProductsController from './Controllers/ProductsController';
import ShoppingCartController from './Controllers/ShoppingCartController';
import DiscountController from './Controllers/DiscountController';
import SplitPaymentController from './Controllers/SplitPaymentController';
import SalesHistoryController from './Controllers/SalesHistoryController';
import ProductManagementController from './Controllers/ProductManagementController';
import ProductRegistrationController from './Controllers/ProductRegistrationController';
import CategoryManagementController from './Controllers/CategoryManagementController';
import CategoryRegistrationController from './Controllers/CategoryRegistrationController';
import StatisticController from './Controllers/StatisticController';
import ProductData from './Models/ProductData';
import SalesData from './Models/SalesData';
import ShoppingCartData from './Models/ShoppingCartData';
import CashCheckController from './Controllers/CashCheckController';
import CashCheckData from './Models/CashCheckData';
import PaymentData from './Models/PaymentData';
import './resources.js';
import {
  CashCheckDataInterface,
  PaymentDataInterface,
  ProductDataInterface,
  SalesDataInterface,
  ShoppingCartDataInterface,
} from './interfaces/ModelInterfaces';

class App {
  #productData: ProductDataInterface;

  #salesData: SalesDataInterface;

  #shoppingCartData: ShoppingCartDataInterface;

  #cashCheckData: CashCheckDataInterface;

  #paymentData: PaymentDataInterface;

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
    new DiscountController(this.#shoppingCartData, this.#paymentData).init();
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
