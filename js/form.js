import {isEscape} from './util.js';
import { uploadData } from './fetch.js';
import {addFilter, deleteFilter, resetScale} from './effects.js';
import './user-image.js';

const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

const formElement = document.querySelector('.img-upload__form');
const formEditElement = formElement.querySelector('.img-upload__overlay');
const uploadInputElement = formElement.querySelector('.img-upload__input');
const closeButtonElement = formElement.querySelector('.img-upload__cancel');
const btnFormSubmitElement = formElement.querySelector('.img-upload__submit');
const inputHashtagsElement = formElement.querySelector('.text__hashtags');
const inputDescriptionElement = formElement.querySelector('.text__description');

const pristine = new Pristine(formElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

const closeFormEdit = (event) => {
  if (isEscape(event)){
    closeForm();
  }
};

const openForm = () => {
  formEditElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  uploadInputElement.removeEventListener('change', openForm);

  closeButtonElement.addEventListener('click', closeForm);
  document.addEventListener('keydown', closeFormEdit);

  resetScale();
  addFilter();

  btnFormSubmitElement.disabled = false;
};

function closeForm (){
  formEditElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  formElement.reset();
  pristine.reset();

  closeButtonElement.removeEventListener('click', closeForm);
  document.removeEventListener('keydown', closeFormEdit);

  uploadInputElement.addEventListener('change', openForm);

  deleteFilter();
}

uploadInputElement.addEventListener('change', openForm);


let errorMessage = '';

const error = () => errorMessage;

const onHashtagInput = () => {
  btnFormSubmitElement.disabled = !pristine.validate();
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

pristine.addValidator(inputHashtagsElement, hashtagsHandler, error);

inputHashtagsElement.addEventListener('input', onHashtagInput);

inputHashtagsElement.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});


const validateDescription = (value) =>  value.length <= 140;

pristine.addValidator(
  inputDescriptionElement,
  validateDescription,
  'Комментарий не должен превышать 140 символов'
);

inputDescriptionElement.addEventListener('input', onHashtagInput);

inputDescriptionElement.addEventListener('keydown', (evt) => {
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

    document.addEventListener('keydown', closeFormEdit);
    btnFormSubmitElement.disabled = false;
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

const onError = () => {
  showMessage('error');
  document.removeEventListener('keydown', closeFormEdit);
};

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!pristine.validate()){
    return true;
  }

  const formData = new FormData(evt.target);
  btnFormSubmitElement.disabled = true;

  uploadData(() => {
    closeForm();
    showMessage('success');
  }, () => {
    onError();
  }, 'POST', formData);
});

