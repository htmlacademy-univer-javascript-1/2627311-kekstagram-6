import {isEscape} from './util.js';

const COMMENTS_STEP = 5;

const bigPictureElement = document.querySelector('.big-picture');
const commentsListElement = bigPictureElement.querySelector('.social__comments');
const commentsCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const closeButtonElement = bigPictureElement.querySelector('.big-picture__cancel');

let currentShow = 0;
let onCommentsLoaderClick = null;

const renderComment = (comment) => {
  const {avatar, name, message} = comment;
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = avatar;
  img.alt = name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.classList.add('social__text');
  p.textContent = message;

  li.append(img, p);

  return li;
};

const renderListComments = (comments) => {
  const length = currentShow;

  for (let i = length; i < length + COMMENTS_STEP; i++){
    if (comments[i]){
      commentsListElement.append(renderComment(comments[i]));
      currentShow++;
    }
  }

  if(currentShow >= comments.length){
    commentsLoaderElement.classList.add('hidden');
  }

  commentsCountElement.innerHTML =`<span class="social__comment-shown-count">${currentShow}</span> из <span class="social__comment-total-count comments-count">${comments.length}</span> комментариев`;
};

const onDocumentKeydown = (event) => {
  if (isEscape(event)){
    onCloseButtonClick();
  }
};

function onCloseButtonClick() {
  bigPictureElement.classList.add('hidden');
  commentsCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
  closeButtonElement.removeEventListener('click', onCloseButtonClick);

  currentShow = 0;
}

const showBigPicture = (arr) => {
  const {url, description, likes, comments} = arr;

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.querySelector('.big-picture__img img').src = url;
  document.querySelector('.big-picture__img img').alt = description;
  document.querySelector('.social__caption').textContent = description;
  document.querySelector('.likes-count').textContent = likes;

  commentsListElement.innerHTML = '';

  renderListComments(comments);

  onCommentsLoaderClick = () => {
    renderListComments(comments);
  };
  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);

  document.addEventListener('keydown', onDocumentKeydown);
  closeButtonElement.addEventListener('click', onCloseButtonClick);
};

export {showBigPicture};
