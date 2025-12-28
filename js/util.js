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

const showMessageError = () => {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('data-error');
  messageContainer.style.zIndex = '100';
  messageContainer.style.position = 'fixed';
  messageContainer.style.left = '50%';
  messageContainer.style.top = '40%';
  messageContainer.style.transform = 'translate(-50%, -50%)';
  messageContainer.style.padding = '100px 200px';
  messageContainer.style.fontSize = '45px';
  messageContainer.style.background = 'rgb(236, 74, 74)';
  messageContainer.style.color = 'white';
  messageContainer.style.lineHeight = '1.5';
  messageContainer.style.borderRadius = '8px';
  messageContainer.textContent = 'Ошибка загрузки';

  document.body.append(messageContainer);
};

export {isEscape, debounce, shuffleArray, showMessageError};
