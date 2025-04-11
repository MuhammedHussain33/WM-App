// utils/localStorageUtils.js

export const getFromLocalStorage = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return null;
    }
  };
  
  export const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  };
  