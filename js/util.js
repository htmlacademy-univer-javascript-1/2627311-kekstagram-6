const getRandomIntInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createIdGenerator = () => {
  let currentId = 1;
  return function () {
    return currentId++;
  };
};

export {getRandomIntInRange, createIdGenerator};
