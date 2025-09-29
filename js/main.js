const photoDescriptions = [
    'Вид из окна',
    'Улица ночью',
    'На берегу моря',
    'Старая архитектура',
    'Рассвет в горах'
  ],
  commentsMessage = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],
  commentNames = [
    'Илья',
    'Максим',
    'Алина',
    'Анатолий',
    'Михаил',
    'Виктория'
  ],
  PHOTO_COUNT = 25,
  photos = [];

const getRandomIntInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createIdGenerator = () => {
  let currentId = 1;
  return function () {
    return currentId++;
  };
};
const generateCommentId = createIdGenerator();

const generateCommentMessage = () => {
  const count = getRandomIntInRange(1, 2);
  let message = '';
  for (let i = 0; i < count; i++) {
    const sentence =
      commentsMessage[getRandomIntInRange(0, commentsMessage.length - 1)];
    if (i === 0) {
      message += sentence;
    } else {
      message += `' ' + ${sentence}`;
    }
  }
  return message;
};

const generateComments = () => {
  const count = getRandomIntInRange(0, 30),
    comments = [];
  for (let i = 0; i < count; i++) {
    comments.push({
      id: generateCommentId(),
      avatar: `img/avatar-${getRandomIntInRange(1, 6)}.svg`,
      message: generateCommentMessage(),
      name: commentNames[getRandomIntInRange(0, commentNames.length - 1)],
    });
  }
  return comments;
};

const generateArrayPhotos = () => {
  for (let i = 1; i <= PHOTO_COUNT; i++){
    photos.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: photoDescriptions[(i - 1) % photoDescriptions.length],
      likes: getRandomIntInRange(15, 200),
      comments: generateComments(),
    });
  }

  return photos;
};

generateArrayPhotos();
