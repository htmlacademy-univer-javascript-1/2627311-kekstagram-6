const bigPicture = document.querySelector('.big-picture');
const commentsContainer = document.querySelector('.social__comments');
const commentCount = document.querySelector('.social__comment-count');
const commentsLoader = document.querySelector('.comments-loader');
const closeButton = document.querySelector('.big-picture__cancel');
let currentShow = 0;
let onCommentsLoad = null;

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

  for (let i = length; i < length + 5; i++){
    if (comments[i]){
      commentsContainer.append(renderComment(comments[i]));
      currentShow++;
    }
  }

  if(currentShow >= comments.length){
    commentsLoader.classList.add('hidden');
  }

  commentCount.firstChild.textContent = `${currentShow} из `;
};

const closeBigPictureKeydown = (event) => {
  if (event.key === 'Escape'){
    closeBigPicture();
  }
};

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  commentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', closeBigPictureKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoad);
  currentShow = 0;
}

const showBigPicture = (arr) => {
  const {url, description, likes, comments} = arr;

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.querySelector('.big-picture__img img').src = url;
  document.querySelector('.big-picture__img img').alt = description;
  document.querySelector('.social__caption').textContent = description;
  document.querySelector('.likes-count').textContent = likes;
  document.querySelector('.comments-count').textContent = comments.length;

  commentsContainer.innerHTML = '';

  renderListComments(comments);

  commentCount.firstChild.textContent = `${currentShow} из `;

  onCommentsLoad = () => {
    renderListComments(comments);
  };
  commentsLoader.addEventListener('click', onCommentsLoad);

  document.addEventListener('keydown', closeBigPictureKeydown);
  closeButton.addEventListener('click', closeBigPicture);
};

export {showBigPicture};
