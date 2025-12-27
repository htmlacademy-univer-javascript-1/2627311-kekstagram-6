const isEscape = (event) => event.key === 'Escape';

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const shuffleArray = (array) => {
  const result = array.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const onError = () => {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="error-box" style="
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgb(236, 74, 74);
        color: white;
        padding: 100px 200px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 45px;
        font-weight: bold;
        z-index: 9999;
    ">
        Ошибка загрузки
    </div>
  `);
};

export {isEscape, debounce, shuffleArray, onError};
