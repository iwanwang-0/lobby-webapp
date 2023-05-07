export default (num, decimal = 2) => {
  if (typeof num === 'number') {
    return Math.round(num * (10 ** decimal)) / (10 ** decimal);
  }
  return num;
};
