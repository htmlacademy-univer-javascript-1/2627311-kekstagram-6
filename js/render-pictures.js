import {showBigPicture} from './big-picture.js';

const containerElement = document.querySelector('.pictures');
const templateElement = document.querySelector('#picture');
const fragmentElement = document.createDocumentFragment();

const renderPicture = (arr) => {
  const {url, description, likes, comments} = arr;
  const clone = templateElement.content.querySelector('.picture').cloneNode(true);

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

const renderPictures = (picturesData) => {
  picturesData.forEach((arr) => {
    fragmentElement.appendChild(renderPicture(arr));
  });

  containerElement.appendChild(fragmentElement);
};

const removePictures = () => {
  const photos = document.querySelectorAll('.picture');
  if (photos) {
    photos.forEach((photo) => photo.remove());
  }
};

export {renderPictures, removePictures};
