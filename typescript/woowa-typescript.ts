// 우아한 타입스크립트를 읽으며 기록할만한 Utility Type을 기록합니다.

type CustomNonNullable<T> = T extends null | undefined ? never : T;

// Promise.all로부터 response | null 이 반환되는 경우
// 특정 key가 존재하지 않는 response를 필터링할 경우 NonNullable 없이는 response | null 타입이 반환된다.
// 이러한 경우를 위해 사용한다.
// ex) shopAds = shopAdList.filter(NonNullable)
function NonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null || value !== undefined;
}

// 특정 객체로부터 key, value쌍을 매칭한다.
// P는 전체객체, T는 P객체의 key들
// 처음 생각한 프로토타입
// key list중 특정 타입을 Exclude하는것
type MyPickOne<P, T extends keyof P> = Record<T, P[T]> &
  Partial<Record<keyof Exclude<T, P[T]>, undefined>>;

// T는 대상객체, P는 대상 객체의 Key값들
/** @description 여러 타입 중 구분자 key없이 각각 다른 key를 구분해내는 유틸리티 타입  */
type AnswerPickOne<T> = {
  [P in keyof T]: Record<P, T[P]> &
    Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];

/** @description Promise.all 시에 내부의 항목들을 추론하기 위한 type */
type UnwrapPromise<T> = T extends Promise<infer K>[] ? K : any;
