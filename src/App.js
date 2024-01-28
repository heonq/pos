import HeaderController from './Controllers/HeaderController.js';
import ProductsController from './Controllers/ProductsController.js';
import ShoppingCartController from './Controllers/ShoppingCartController.js';

class App {
  play() {
    new HeaderController().init();
    new ProductsController().init();
    new ShoppingCartController().init();
  }
}

export default App;
