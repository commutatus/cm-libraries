export const deepCopy = (item) => {
  if (Array.isArray(item)) {
    return deepCopyArray(item);
  }
  if (typeof item === 'object') {
    return deepCopyObject(item);
  }
  return item;
};

export const deepCopyArray = (arr) => {
  if (!arr) {
    return arr;
  }
  const copy = [];
  arr.forEach(elem => {
    if (Array.isArray(elem)) {
      copy.push(deepCopyArray(elem));
    } else {
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem));
      } else {
        copy.push(elem);
      }
    }
  });
  return copy;
};

export const deepCopyObject = (obj) => {
  if (!obj) {
    return obj;
  }

  const keys = Object.keys(obj);
  if (!keys.length) {
    return obj;
  }
  const tempObj = {};
  for (const key of keys) {
    if (Array.isArray(obj[key])) {
      tempObj[key] = deepCopyArray(obj[key]);
    } else {
      if (typeof obj[key] === 'object') {
        tempObj[key] = deepCopyObject(obj[key]);
      } else {
        tempObj[key] = obj[key];
      }
    }
  }
  return tempObj;
};
