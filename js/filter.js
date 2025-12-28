import {debounce, shuffleArray} from './util.js';
import { removePictures, renderPictures } from './render-pictures.js';

const COUNT_OF_FILTER = 10;
const ACTIVE_CLASS = 'img-filters__button--active';

const imgFiltersElement = document.querySelector('.img-filters');
const imgFiltersFormElement = imgFiltersElement.querySelector('.img-filters__form');

const initSort = (photos) => {
  const availableFilters = {
    'filter-default': () => photos.slice(),
    'filter-random': () => shuffleArray(photos.slice(0, COUNT_OF_FILTER)),
    'filter-discussed': () => photos.slice().sort((firstElem, secondElem) => secondElem.comments.length - firstElem.comments.length)
  };

  const isButton = (evt) => evt.target.tagName === 'BUTTON';

  const onImgFiltersFormClick = debounce((evt) => {
    if (isButton(evt)){
      removePictures();

      renderPictures(availableFilters[evt.target.id]());
    }
  });

  const onButtonClick = (evt) => {
    if (isButton(evt)){
      const selectedButton = imgFiltersElement.querySelector(`.${ACTIVE_CLASS}`);

      if (selectedButton){
        selectedButton.classList.remove(ACTIVE_CLASS);
      }

      evt.target.classList.add(ACTIVE_CLASS);
    }
  };

  imgFiltersFormElement.addEventListener('click', onImgFiltersFormClick);
  imgFiltersFormElement.addEventListener('click', onButtonClick);
};

export {initSort};
