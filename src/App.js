import HeaderController from './Header.js';

class App {
  constructor() {
    this.header = new HeaderController();
  }

  play() {
    this.header.init();
  }
}

export default App;
