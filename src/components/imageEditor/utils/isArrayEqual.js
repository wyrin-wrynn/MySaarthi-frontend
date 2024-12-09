// components/imageEditor/utils/isArraysEqual.js
export const isArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      const el1 = arr1[i];
      const el2 = arr2[i];
      const keys1 = Object.keys(el1);
      const keys2 = Object.keys(el2);
      if (keys1.length !== keys2.length) return false;
      for (let k of keys1) {
        if (el1[k] !== el2[k]) return false;
      }
    }
    return true;
  };
  