import {isEscape} from './util.js';
import { uploadData } from './fetch.js';
import {addFilter, deleteFilter, resetScale} from './effects.js';
import './user-image.js';

const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

const form = document.querySelector('.img-upload__form');
const formEdit = form.querySelector('.img-upload__overlay');
const uploadInput = form.querySelector('.img-upload__input');
const closeButton = form.querySelector('.img-upload__cancel');
const btnFormSubmit = form.querySelector('.img-upload__submit');
const inputHashtags = form.querySelector('.text__hashtags');
const inputDescription = form.querySelector('.text__description');

const closeFormEdit = (event) => {
  if (isEscape(event)){
    closeEditor();
  }
};

const openEditor = () => {
  formEdit.classList.remove('hidden');
  document.body.classList.add('modal-open');

  uploadInput.removeEventListener('change', openEditor);

  closeButton.addEventListener('click', closeEditor);
  document.addEventListener('keydown', closeFormEdit);

  resetScale();
  addFilter();

  btnFormSubmit.disabled = false;
};

function closeEditor (){
  formEdit.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();

  closeButton.removeEventListener('click', closeEditor);
  document.removeEventListener('keydown', closeFormEdit);

  uploadInput.addEventListener('change', openEditor);

  deleteFilter();
}

uploadInput.addEventListener('change', openEditor);


let errorMessage = '';

const error = () => errorMessage;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

const onHashtagInput = () => {
  btnFormSubmit.disabled = !pristine.validate();
};

const hashtagsHandler = (value) => {
  errorMessage = '';

  const inputText = value.toLowerCase().trim();

  if (!inputText){
    return true;
  }

  const inputArray = inputText.split(/\s+/);

  const rules = [
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      error: 'Хэш-теги разделяются пробелами',
    },
    {
      check: inputArray.some((item) => item[0] !== '#'),
      error: 'Хэш-теги должен начинаться с #',
    },
    {
      check: inputArray.some((item, num, arr) => arr.includes(item, num + 1)),
      error: 'Хэш-теги не должны повторяться',
    },
    {
      check: inputArray.some((item) => item.length > MAX_SYMBOLS),
      error: `Максимальная длина одного хеш-тега ${MAX_SYMBOLS}`,
    },
    {
      check: inputArray.length > MAX_HASHTAGS,
      error: `Максимальное количество хеш-тегов ${MAX_HASHTAGS}`,
    },
    {
      check: inputArray.some((item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
      error: 'Хэш-тег содержит недопустимые символы',
    }
  ];

  return rules.every((rule) => {
    const isInvalid = rule.check;
    if (isInvalid){
      errorMessage = rule.error;
    }

    return !isInvalid;
  });
};

pristine.addValidator(inputHashtags, hashtagsHandler, error);

inputHashtags.addEventListener('input', onHashtagInput);

inputHashtags.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});


const validateDescription = (value) =>  value.length <= 140;

pristine.addValidator(
  inputDescription,
  validateDescription,
  'Комментарий не должен превышать 140 символов'
);

inputDescription.addEventListener('input', onHashtagInput);

inputDescription.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

const showMessage = (message) => {
  const messageTemplate = document.querySelector(`#${message}`);
  const sectionMessage = messageTemplate.content.querySelector(`.${message}`).cloneNode(true);

  document.body.insertAdjacentElement('beforeend', sectionMessage);
  const closeMessageButton = document.querySelector(`.${message}__button`);

  const closeMessage = () => {
    sectionMessage.remove();
    closeMessageButton.removeEventListener('click', closeMessage);
    document.removeEventListener('keydown', escapeMessage);
    document.removeEventListener('click', closeMessageByClick);
  };

  function escapeMessage (event)  {
    if (isEscape(event)){
      closeMessage();
    }
  }

  function closeMessageByClick(e){
    if (e.target && e.target.classList.contains(message)){
      closeMessage();
    }
  }

  closeMessageButton.addEventListener('click', closeMessage);
  document.addEventListener('keydown', escapeMessage);
  document.addEventListener('click', closeMessageByClick);
};

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!pristine.validate()){
    return true;
  }

  const formData = new FormData(evt.target);
  btnFormSubmit.disabled = true;

  uploadData(() => {
    closeEditor();
    showMessage('success');
  }, () => {
    closeEditor();
    showMessage('error');
  }, 'POST', formData);
});
