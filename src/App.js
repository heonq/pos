import HeaderController from './Controllers/HeaderController.js';
import ProductsController from './Controllers/ProductsController.js';
import ShoppingCartController from './Controllers/ShoppingCartController.js';
import DiscountController from './Controllers/DiscountController.js';
import SplitPaymentController from './Controllers/SplitPaymentController.js';
import SalesHistoryController from './Controllers/SalesHistoryController.js';

class App {
  play() {
    new HeaderController().init();
    new ProductsController().init();
    new ShoppingCartController().init();
    new DiscountController().init();
    new SplitPaymentController().init();
    new SalesHistoryController().init();
  }
}

export default App;
