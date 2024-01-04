// extends로 인해 확장된 타입들을 디버깅하기 용이하도록 해주는 유틸리티 타입
/**
 * 아래의 코드에서 & {} 를 사용해주는 이유는 이를 작성해주기때문에 제대로 Mapped types로 평가되어 해당 타입을 통해 Mapped Type의 특성인 기존 타입을 순회를 통한 재구성이 가능해진다고 함.
 * 이를 사용하지 않는 경우에는 Type은 단순히 Alias로 평가되어 이를 직접 사용하기 전까지 타입에 대한 평가를 미루어(Lazy Evaluated) Mapped Type의 장점을 누릴 수 없다고 했음.
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// 특정 타입을 확장하여 사용하는 유니온타입의 경우 세부 내용까지 추론될 수 있도록 하는 유틸리티 타입
type UnionPrettify<T> = T extends any ? T : never;
