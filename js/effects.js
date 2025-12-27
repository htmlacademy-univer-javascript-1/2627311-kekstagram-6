const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;

const img = document.querySelector('.img-upload__preview').children[0];
const effectsList = document.querySelector('.effects__list');
const sliderEffectLevel = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');
const slider = document.querySelector('.img-upload__effect-level');
const btnScaleSmaller = document.querySelector('.scale__control--smaller');
const btnScaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');

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

const addFilter = () => {
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
};

const deleteFilter = () => {
  effectsList.removeEventListener('change', filterChangeHandler);
  sliderEffectLevel.noUiSlider.destroy();
};

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

const resetScale = () => {
  currentScale = 100;
  img.style.transform = 'scale(1)';
};

btnScaleSmaller.addEventListener('click', () => changeScale(-STEP_SCALE));
btnScaleBigger.addEventListener('click', () => changeScale(STEP_SCALE));

export {addFilter, deleteFilter, resetScale};
