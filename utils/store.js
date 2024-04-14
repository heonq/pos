const store = {
  getStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || null;
  },

  setStorage(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
  },
};

export default store;
