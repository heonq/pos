import HeaderController from './HeaderController.js';

class App {
  constructor() {
    this.headerController = new HeaderController();
  }

  play() {
    this.headerController.init();
  }
}

export default App;
