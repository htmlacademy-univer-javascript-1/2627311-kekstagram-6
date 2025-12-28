import { loadData } from './fetch.js';
import {renderPictures} from './render-pictures.js';
import { initSort } from './filter.js';
import { showMessageError } from './util.js';
import './form.js';

let photos = [];

const onSuccess = (data) => {
  photos = data.slice();
  renderPictures(photos);
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  initSort(photos);
};

loadData(onSuccess, showMessageError);
