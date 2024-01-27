import HeaderController from './Controllers/HeaderController.js';
import ProductsController from './Controllers/ProductsController.js';

class App {
  play() {
    new HeaderController().init();
    new ProductsController().init();
  }
}

export default App;
