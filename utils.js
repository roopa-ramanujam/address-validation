const isArray = (value) => {
  return Array.isArray(value);
};

const fieldExists = (obj, key) => {
  return key in obj;
};

export { isArray, fieldExists };
