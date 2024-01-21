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

- ref를 주입해주는 대상 컴포넌트의 경우 전달받은 ref를 ref라는 props로 받게된다면 forwardRef로 감싸주어야한다. 이때 제네릭이 2개 필요한데, 첫번째는 ref의 타입이고 두번째는 해당 컴포넌트의 props이다.

- forwardRef의 인자로 넘어가는 콜백 함수는 ForwardRenderFunction 타입으로 이는 다음과 같다.

```
interface ForwardRefRenderFunction<T, P = {}> {
  (props: P, ref: ForwardedRef<T>): ReactElement | null
  displayName?: string | undefined;
  defaultProps?: never | undefined;
  propTypes?: never | undefined
}
```

- 위 타입 역시도 제네릭이 2개 필요한데 T는 해당 ref로 전달하려는 요소의 타입을 넘겨주고 P는 해당 React Component의 Props 타입을 넘겨준다.

- 위에서 ref의 타입으로 정의된 ForwardedRef는 다음과 같다.

```
type ForwardedRef<T> =
  | ((instance: T | null) => void)
  | MutableRefObject<T | null>
  | null;
```

- 여기서 MutableRefObject은 useRef의 반환 타입 중 하나로 ForwardedRef에는 MutableRefObject만 올 수 있는 이유는 MutableRefObject가 RefObject보다 넓은 범위의 타입을 가지기 때문에 부모 컴포넌트에서 ref를 어떻게 선언했는지와 관계없이 자식 컴포넌트가 해당 ref를 수용할 수 있도록 하기 위함이다.

```
interface MutableRefObject<T> {
  current: T
}

interface RefObject<T> {
  readonly current: T | null
}
```

- 위에서 언급한 ForwardRefRenderFunction타입은 실제로는 ref를 주입받는 자식컴포넌트에서 사용하는 useImperativeHandle 메서드의 타입으로 사용이 가능하다. 이 역시 제네릭을 2가지 필요로 하는데 첫번째는 ref에 담아서 넘겨줄 Imperative Handler의 타입이고 두번째는 해당 자식 컴포넌트의 props이다.

```
// 만약 submit을 커스텀해서 ref에 담으려면

type CustomHandler = Pick<HTMLFormElement, 'submit'>

type ChildComponentProps = {
  // ...
}

const ChildComponent: ForwardRefRenderFunction<CustomHandler, ChildComponentProps> = (props, ref) => {
  useImperativeHandler(ref, () => ({
    submit: () => {
      // ...
    }
  }))
  // ...
}
```
