# woowa-typescript

```
// 1. 일반적으로 제네릭이 필요한 함수라면 function 키워드를 사용하는 것이 좋다.

function Test<T>() {
}

// 2. 그럼에도 불구하고 화살표 함수를 써야한다면 제네릭에 extends {}를 통해 jsx 태그가 아님을 명시한다.

const Test = <T extends {}>() => {

}
```

- 타입스크립트의 교차타입과 유니온 타입의 동작을 이해하기 위해서는 타입을 속성의 집합이 아닌 값의 집합으로 보아야한다.
  - 개인적으로는 원시타입의 관점과 커스텀 타입의 관점으로 보였는데, 원시타입의 입장에서 유니온 타입은 A타입 혹은 B타입이 성립되고, 교차타입 역시 교집합임이 성립된다.
  - 다만 속성을 가진 타입들의 관점이라면 유니온 타입은 A타입에 속한 값이거나 B타입에 속한 값이어야하기때문에 교집합이 성립되고, 교차타입은 A타입에도 포함되고, B타입에도 포함되어야하기때문에 두 타입을 모두 합친 합집합 속성이 된다.
