/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */

// from https://github.com/reduxjs/redux/blob/master/src/utils/isPlainObject.js
const isPlainObject: (obj: any) => boolean = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) { return false; }

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
};

export default isPlainObject;