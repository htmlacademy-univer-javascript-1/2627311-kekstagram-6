import { loadData } from './fetch.js';
import {renderPictures} from './render-pictures.js';
import './form.js';

const onSuccess = (data) => {
  renderPictures(data);
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
