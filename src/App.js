import HeaderController from './Controllers/HeaderController.js';
import ProductsController from './Controllers/ProductsController.js';
import ShoppingCartController from './Controllers/ShoppingCartController.js';
import DiscountController from './Controllers/DiscountController.js';

class App {
  play() {
    new HeaderController().init();
    new ProductsController().init();
    new ShoppingCartController().init();
    new DiscountController().init();
  }
}

export default App;
