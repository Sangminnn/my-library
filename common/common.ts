/**
 * @description 배열을 각 요소와 index를 Key, Value로 하는 객체로 만들어 해시테이블 접근이 가능하도록 합니다.
 * ex) ['ㄱ', 'ㄴ', 'ㄷ'] => { 'ㄱ': 0, 'ㄴ': 1, 'ㄷ': 2 }
 *
 * 다만 list의 key를 올바르게 추론하기 위해서는 배열을 as const로 단언해주어야합니다.
 * */
const transformArrayToObject = <T extends string[] | readonly string[]>(
  list: T
) => {
  const result = {} as { [key in T[number]]: number };

  list.forEach((consonant, index) => {
    const key: T[number] = consonant;
    result[key] = index;
  });

  return result;
};
