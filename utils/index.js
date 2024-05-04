const randomDate = () => {
  const minTime = Date.now();
  const maxTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000;

  const randomTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

  const expirationDate = new Date(randomTime);

  return expirationDate;
};

module.exports = { randomDate };
