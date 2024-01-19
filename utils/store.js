const store = {
  getStorage(key) {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key));
    }
  },

  setStorage(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
  },
};

export default store;
