/* eslint-disable max-lines-per-function */
const deepCopy = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let result;
  if (Array.isArray(obj)) {
    result = [];
  } else {
    result = {};
  }

  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepCopy(obj[key]);
    }
  });

  return result;
};

export default deepCopy;
