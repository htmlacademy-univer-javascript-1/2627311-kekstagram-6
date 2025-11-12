const renderPicture = (template, {url, description, likes, comments}) => {
  const clone = template.content.cloneNode(true);

  clone.querySelector('.picture__img').src = url;
  clone.querySelector('.picture__img').alt = description;
  clone.querySelector('.picture__comments').textContent = comments.length;
  clone.querySelector('.picture__likes').textContent = likes;

  return clone;
};

const renderPictures = (picturesData) => {
  const container = document.querySelector('.pictures');
  const template = document.querySelector('#picture');
  const fragment = document.createDocumentFragment();

  picturesData.forEach((arr) => {
    fragment.appendChild(renderPicture(template, arr));
  });

  container.appendChild(fragment);
};

export {renderPictures};
