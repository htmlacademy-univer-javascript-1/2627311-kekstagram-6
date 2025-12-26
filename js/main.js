import { loadData } from './fetch.js';
import {renderPictures} from './render-pictures.js';
import { initSort } from './filter.js';
import './form.js';

let photos = [];

const onSuccess = (data) => {
  photos = data.slice();
  renderPictures(data.slice());
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  initSort(photos);
};

const onError = () => {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="error-box" style="
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgb(236, 74, 74);
        color: white;
        padding: 100px 200px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 45px;
        font-weight: bold;
        z-index: 9999;
    ">
        Ошибка загрузки
    </div>
  `);
};

loadData(onSuccess, onError);
