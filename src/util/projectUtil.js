export const generateRandomNumber = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

export const generateRandomNumberWithRange = (min, max) => {
  const dif = max - min + 1;
  return Math.floor(Math.random() * dif) + min;
};