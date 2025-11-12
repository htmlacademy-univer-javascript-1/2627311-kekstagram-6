import {showBigPicture} from './big-picture.js';

const container = document.querySelector('.pictures');
const template = document.querySelector('#picture');

const renderPicture = (arr) => {
  const {url, description, likes, comments} = arr;
  const clone = template.content.querySelector('.picture').cloneNode(true);

  clone.querySelector('.picture__img').src = url;
  clone.querySelector('.picture__img').alt = description;
  clone.querySelector('.picture__comments').textContent = comments.length;
  clone.querySelector('.picture__likes').textContent = likes;

  clone.addEventListener('click', (e) => {
    e.preventDefault();
    showBigPicture(arr);
  });

  return clone;
};

const fragment = document.createDocumentFragment();

const renderPictures = (picturesData) => {
  picturesData.forEach((arr) => {
    fragment.appendChild(renderPicture(arr));
  });

  container.appendChild(fragment);
};

export {renderPictures};
