
export default (address) => {
  if (address) {
    return address.replace(/^(.{6}).*(.{6})$/g, (str, $1, $2) => `${$1}...${$2}`);
  }
  return '';
};

