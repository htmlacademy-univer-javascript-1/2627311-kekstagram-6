const renderPictures = (picturesData) => {
  const container = document.querySelector('.pictures');
  const template = document.querySelector('#picture');
  const fragment = document.createDocumentFragment();

  picturesData.forEach(({url, description, likes, comments}) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.picture__img').src = url;
    clone.querySelector('.picture__img').alt = description;
    clone.querySelector('.picture__comments').textContent = comments.length;
    clone.querySelector('.picture__likes').textContent = likes;

    fragment.appendChild(clone);
  });

  container.appendChild(fragment);
};

export default renderPictures;
