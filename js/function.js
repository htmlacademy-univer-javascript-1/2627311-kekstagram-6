const compareLengthString = (string, length) =>  string.length <= length;

const checkPalindrom = (string) => {
  const normalString = string.replaceAll(' ', '').toLowerCase();
  let reverseString = '';
  for (let i = normalString.length - 1; i >= 0; i--){
    reverseString += normalString[i];
  }
  return normalString === reverseString;
};

compareLengthString('олень', 5);
checkPalindrom('топот', 'топот');
