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

const setCommaForNumber = (data: string | number) => {
  const stringConvertedData = typeof data === "number" ? String(data) : data;
  return stringConvertedData?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const cuttingNumber = (number: number) => number / 10000;

const EMPTY_FORMAT = {
  zero: 0,
  dash: "-",
} as const;

export const ceilNumber = (value: number, unit: number) =>
  Math.ceil(value / (unit * 10)) * (unit * 10);
export const floorNumber = (value: number, unit: number) =>
  Math.floor(value / (unit * 10)) * (unit * 10);
export const roundNumber = (value: number, unit: number) =>
  Math.round(value / (unit * 10)) * (unit * 10);

const FORMAT_ACTION = {
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
};

type FormatNumberToKRWProps = {
  value: number;
  emptyFormat?: keyof typeof EMPTY_FORMAT;
  dividePriceLine: number;
  options?: {
    action?: "ceil" | "floor" | "round";
    actionTargetLine?: number;
  };
};

/**
 * @description
 * 기본적으로 각 금액은 천원 아래는 절삭되어 내려옵니다.
 *
 * 기본 요구사항
 * 1. 0원일때 어떻게 보여줄지
 * 2. n원단위에서 올림, 반올림, 내림 처리할지
 * 3. m원을 기준으로 이상은 -만원, 아래는 -원으로 표기
 *
 *
 * parameter
 * 1. 0일때 노출할 방식 ( zero | dash )
 * 2-1. 특정 금액선
 * 2-2. 2-1 금액선에서 올림처리할지 내림처리할지 반올림할지 (ceil, floor, round)
 * 3. (콤마 달고) 원 / 만원 표기를 위한 특정 금액선 (숫자 제거지점)
 *
 *
 * ex) 1000원단위에서 올림, 내림, 반올림
 *
 * Math.ceil(12345 / 10000) -> 1.2345가 올림처리 -> 2*10000 = 20000
 * Math.round(16345 / 10000) -> 1.6345가 반올림처리 -> 2*10000 = 20000
 *
 * -> 받아온 actionTargetLine에서 10을 곱해주어야 해당 자리에서 작업이 진행됩니다.
 */
const formatNumberToKRW = ({
  value,
  emptyFormat = "dash",
  dividePriceLine,
  options: { action = "ceil", actionTargetLine = 1000 } = {},
}: FormatNumberToKRWProps) => {
  if (!value) return `${EMPTY_FORMAT[emptyFormat]}원`;

  const formattedNumber =
    FORMAT_ACTION[action](value / (actionTargetLine * 10)) *
    (actionTargetLine * 10);

  return value > dividePriceLine
    ? `${setCommaForNumber(cuttingNumber(formattedNumber))}만원`
    : `${setCommaForNumber(formattedNumber)}원`;
};

export default formatNumberToKRW;

/** @description 소수점을 커버하는 반올림 로직, 표현하고싶은 소수점자리를 point에 넣으면 된다. ex) point 2 = 0.00  */
export function roundFloatNumber(value: number, point: number) {
  return +(Math.round(Number(value + `e+${point}`)) + `e-${point}`);
}
