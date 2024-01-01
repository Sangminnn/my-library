// extends로 인해 확장된 타입들을 디버깅하기 용이하도록 해주는 유틸리티 타입
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
