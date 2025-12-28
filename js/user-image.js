const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const fileChooserElement = document.querySelector('.img-upload__input');
const previewElement = document.querySelector('.img-upload__preview img');
const effectsPreviewsElement = document.querySelectorAll('.effects__preview');

fileChooserElement.addEventListener('change', () => {
  const file = fileChooserElement.files[0];

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((fileType) => fileName.endsWith(fileType));

  if (matches) {
    const imageUrl = URL.createObjectURL(file);

    previewElement.src = imageUrl;

    effectsPreviewsElement.forEach((effectPreview) => {
      effectPreview.style.backgroundImage = `url(${imageUrl})`;
    });
  }
});
