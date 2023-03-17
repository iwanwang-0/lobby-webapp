export default (num, decimal) => {
  if (typeof num === 'number') {
    return Math.round(num * decimal ** 10) / decimal ** 10;
  }
  return num;
};
