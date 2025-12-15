import {isEscape} from './util.js';
import { uploadData } from './fetch.js';

const form = document.querySelector('.img-upload__form');
const formEdit = form.querySelector('.img-upload__overlay');
const uploadInput = form.querySelector('.img-upload__input');
const closeButton = form.querySelector('.img-upload__cancel');
const btnFormSubmit = form.querySelector('.img-upload__submit');

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

const inputHashtags = form.querySelector('.text__hashtags');
const inputDescription = form.querySelector('.text__description');


//валидация хэш-тегов

let errorMessage = '';
const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

const error = () => errorMessage;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

const onHashtagInput = () => {
  if (pristine.validate()){
    btnFormSubmit.disabled = false;
  } else {
    btnFormSubmit.disabled = true;
  }
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

//валидация Комментарий

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

//эффект масштаб

const btnScaleSmaller = document.querySelector('.scale__control--smaller');
const btnScaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const img = document.querySelector('.img-upload__preview').children[0];
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;

let currentScale = 100;

const changeScale = (value) => {
  if (currentScale + value < MIN_SCALE || currentScale + value > MAX_SCALE){
    return true;
  } else {
    currentScale += value;
    scaleValue.value = `${currentScale}%`;
    img.style.transform = `scale(${currentScale / 100})`;
  }
};

function resetScale(){
  currentScale = 100;
  img.style.transform = 'scale(1)';
}

btnScaleSmaller.addEventListener('click', () => changeScale(-STEP_SCALE));
btnScaleBigger.addEventListener('click', () => changeScale(STEP_SCALE));

// Наложение эффекта

const effectsList = document.querySelector('.effects__list');
const sliderEffectLevel = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');
const slider = document.querySelector('.img-upload__effect-level');


const effects = {
  none: {
    options: { range: { min: 0, max: 1 }, start: 1, step: 0.1, connect: 'lower'},
    getValue: () => ''
  },
  chrome: {
    options: {range: {min: 0, max: 1}, start: 1, step: 0.1},
    getValue: (value) => `grayscale(${value})`
  },
  sepia: {
    options: {range: {min: 0, max: 1}, start: 1, step: 0.1},
    getValue: (value) => `sepia(${value})`
  },
  marvin: {
    options: {range: {min: 0, max: 100}, start: 100, step: 1},
    getValue: (value) => `invert(${value}%)`
  },
  phobos: {
    options: {range: {min: 0, max: 3}, start: 3, step: 0.1},
    getValue: (value) => `blur(${value}px)`
  },
  heat: {
    options: {range: {min: 1, max: 3}, start: 3, step: 0.1},
    getValue: (value) => `brightness(${value})`
  }
};

const filterChangeHandler = (event) => {
  const currentEffect = event.target.value;

  const effect = effects[currentEffect];

  sliderEffectLevel.noUiSlider.updateOptions(effect.options);
  sliderEffectLevel.noUiSlider.set(effect.options.start);

  if (currentEffect === 'none'){
    img.style.filter = '';
    slider.classList.add('hidden');
    effectValue.value = '';

    return true;
  }

  slider.classList.remove('hidden');

  effectValue.value = effect.options.start;
};

function addFilter  ()  {
  img.style.filter = '';
  noUiSlider.create(sliderEffectLevel, effects.none.options);
  effectValue.value = '';
  slider.classList.add('hidden');

  sliderEffectLevel.noUiSlider.on('update', () => {
    const currentEffect = document.querySelector('.effects__radio:checked').value;

    if (currentEffect === 'none') {return true;}

    const value = sliderEffectLevel.noUiSlider.get();
    effectValue.value = parseFloat(value);

    const effect = effects[currentEffect];
    img.style.filter = effect.getValue(value);
  });

  effectsList.addEventListener('change', filterChangeHandler);
}

function deleteFilter(){
  effectsList.removeEventListener('change', filterChangeHandler);
  sliderEffectLevel.noUiSlider.destroy();
}

