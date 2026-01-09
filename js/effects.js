const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;

const formElement = document.querySelector('.img-upload__form');
const imageElement = formElement.querySelector('.img-upload__preview').children[0];
const effectsListElement = formElement.querySelector('.effects__list');
const sliderEffectLevelElement = formElement.querySelector('.effect-level__slider');
const effectValueElement = formElement.querySelector('.effect-level__value');
const sliderElement = formElement.querySelector('.img-upload__effect-level');
const btnScaleSmallerElement = formElement.querySelector('.scale__control--smaller');
const btnScaleBiggerElement = formElement.querySelector('.scale__control--bigger');
const scaleValueElement = formElement.querySelector('.scale__control--value');

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

const onEffectsListChange = (event) => {
  const currentEffect = event.target.value;

  const effect = effects[currentEffect];

  sliderEffectLevelElement.noUiSlider.updateOptions(effect.options);
  sliderEffectLevelElement.noUiSlider.set(effect.options.start);

  if (currentEffect === 'none'){
    imageElement.style.filter = '';
    sliderElement.classList.add('hidden');
    effectValueElement.value = '';

    return true;
  }

  sliderElement.classList.remove('hidden');

  effectValueElement.value = effect.options.start;
};

const addFilter = () => {
  imageElement.style.filter = '';
  noUiSlider.create(sliderEffectLevelElement, effects.none.options);
  effectValueElement.value = '';
  sliderElement.classList.add('hidden');

  sliderEffectLevelElement.noUiSlider.on('update', () => {
    const currentEffect = effectsListElement.querySelector('.effects__radio:checked').value;

    if (currentEffect === 'none') {return true;}

    const value = sliderEffectLevelElement.noUiSlider.get();
    effectValueElement.value = parseFloat(value);

    const effect = effects[currentEffect];
    imageElement.style.filter = effect.getValue(value);
  });

  effectsListElement.addEventListener('change', onEffectsListChange);
};

const deleteFilter = () => {
  effectsListElement.removeEventListener('change', onEffectsListChange);
  sliderEffectLevelElement.noUiSlider.destroy();
};

let currentScale = MAX_SCALE;

const changeScale = (value) => {
  if (currentScale + value < MIN_SCALE || currentScale + value > MAX_SCALE){
    return true;
  } else {
    currentScale += value;
    scaleValueElement.value = `${currentScale}%`;
    imageElement.style.transform = `scale(${currentScale / MAX_SCALE})`;
  }
};

const resetScale = () => {
  currentScale = MAX_SCALE;
  imageElement.style.transform = 'scale(1)';
};

btnScaleSmallerElement.addEventListener('click', () => changeScale(-STEP_SCALE));
btnScaleBiggerElement.addEventListener('click', () => changeScale(STEP_SCALE));

export {addFilter, deleteFilter, resetScale};
