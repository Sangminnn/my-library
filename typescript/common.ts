// extends로 인해 확장된 타입들을 디버깅하기 용이하도록 해주는 유틸리티 타입
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// 특정 타입을 확장하여 사용하는 유니온타입의 경우 세부 내용까지 추론될 수 있도록 하는 유틸리티 타입
type UnionPrettify<T> = T extends any ? T : never;
