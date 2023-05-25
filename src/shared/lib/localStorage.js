export class LocalStorage {
  static getData(key) {
    return localStorage.getItem(key);
  }

  static setData(key, value) {
    localStorage.setItem(key, value);
    return localStorage.getItem(key);
  }

  static clearLocalStorage() {
    localStorage.clear();
  }
}
