const CHO_HANGUL = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
  'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
  'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const JUNG_HANGUL = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
  'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
  'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

const HANGUL_START_CHARCODE = "가".charCodeAt();

const CHO_PERIOD = Math.floor("까".charCodeAt() - "가".charCodeAt());
const JUNG_PERIOD = Math.floor("개".charCodeAt() - "가".charCodeAt());

function combine(cho, jung, jong) {
  return String.fromCharCode(
    HANGUL_START_CHARCODE + cho * CHO_PERIOD + jung * JUNG_PERIOD + jong
  );
}

// function makeRegexByCho(search = "") {
//   const regex = CHO_HANGUL.reduce(
//     (acc, cho, index) =>
//       acc.replace(
//         new RegExp(cho, "g"),
//         `[${combine(index, 0, 0)}-${combine(index + 1, 0, -1)}]`
//       ),
//     search
//   );

//   return new RegExp(`(${regex})`, "g");
// }

function makeRegexByCho(search = "") {
  const regex = CHO_HANGUL.reduce((acc, cho, index) => {
      let temp = JUNG_HANGUL.reduce((acc, jung, jung_index) => {
          return acc.replace(
              new RegExp(combine(index, jung_index, 0), "g"),
              `[${combine(index, jung_index, 0)}-${combine(index, jung_index + 1, -1)}]`
          )
      }, acc);

      return temp.replace(
          new RegExp(cho, "g"),
          `[${combine(index, 0, 0)}-${combine(index + 1, 0, -1)}]`
      )
  },
      search
  );

  return new RegExp(`(${regex})`, "g");
}

function includeByCho(search, targetWord) {
  return makeRegexByCho(search).test(targetWord);
}

export {
  includeByCho,
};