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

- React v18이전에 React.VFC는 children을 허용하지 않는 Function Component타입, React.FC는 children을 허용하는 Function Component 타입임. 하지만 v18부터는 React.VFC는 삭제, React.FC는 children을 가지고있지 않게되어 React.FC 혹은 props타입과 반환 타입을 직접 지정하는 형태로 변경됨.

- React.ReactNode는 ReactElement이외에 boolean, number 등 여러 타입을 포함하고있기에 구체적인 타입을 명시하기에는 적합하지 않다.

- React.ReactElement, JSX.Element, React.ReactNode 비교

  - React.ReactElement: createElement의 반환타입으로 가상 DOM의 엘리먼트 타입이다. 이는 리액트 컴포넌트를 객체 형태로 저장하기 위한 포맷이다.

  ```
    // 실제로는 아래와 같은 JSX 객체형태
    const element = React.createElement(
      'h1',
      { className: 'greeting' },
      "hello, world"
    )
  ```

  - JSX.Element: 아래 타입과 같고 근본은 ReactElement의 확장형태로 props와 type 필드가 any타입이다. 글로벌 네임스페이스에 존재하기에 외부 라이브러리에서 컴포넌트 타입을 재정의하거나 변경하는 것에 용이

  ```
    declare global {
      namespace JSX {
        interface Element extends React.ReactElement<any, any> {}
      }
    }
  ```

  - React.ReactNode: 아래의 타입으로 ReactElement외에 다양한 타입을 가지고 있음.

  ```
    type ReactText = string | number;
    type ReactChild = ReactElement | ReactText
    type ReactFragment = {} | Iterable<ReactNode>

    type ReactNode =
    | ReactChild
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined
  ```

  - 결론은 ReactNode, ReactElement, JSX.Element 순으로 집합의 하위계층에 속하게된다.

- JSX문법은 js를 확장한 문법으로 기본 HTML형태를 작성하면 이를 React.createElement로 자동변환해주는 문법이다.

- React.ReactNode 타입은 React 엘리먼트가 가질 수 있는 모든 타입의 집약체 (PropsWithChildren도 children을 React.ReactNode로 내장하고있음.)

- JSX.Element는 props와 type 필드가 any인 ReactElement이기때문에 React 엘리먼트를 prop으로 전달받아 render props 패턴으로 컴포넌트를 구현할 때 유용

```
interface Props {
  icon: JSX.Element // 하지만 React.ReactElement<IconProps> 와 같이 작성하면 실 사용처에서 타입이 정확하게 추론된다.
}

const Item = ({ icon }: Props) => {
  const iconSize = icon.props.size

  return (<li>{icon}</li>)
}

const App = () => {
  return <Item icon={<Icon size={14} />} />

}
```

- HTML 태그의 속성타입을 활용하는 방법 DetailedHTMLProps, **ComponentWithoutRef** 이 있다.

```
type NativeButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
type ButtonProps = {
  onClick?: NativeButtonProps['onClick'] // MouseEventHandler<HTMLButtonElement> | undefined
}

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>
type ButtonProps = {
  onClick?: NativeButtonType['onClick'] // MouseEventHandler<HTMLButtonElement> | undefined
}
```

- 클래스 컴포넌트에서 ref 객체는 마운트된 컴포넌트 인스턴스를 current로 가지지만, 함수 컴포넌트에서는 생성된 인스턴스가 없기 때문에 ref에 기대한 값이 할당되지 않는다. 이때 ref를 전달받을 수 있도록 돕는 것이 forwardRef. 정리해보자면 기본적인 HTML태그를 확장하는 컴포넌트를 만들고자 한다면 ref와 ComponentWithoutRef를 활용할 수 있다.

```
type NativeButtonType = React.ComponentPropsWithoutRef<'button'> // Ref는 없음.

const Button = forwardRef<HTMLButtonElement, NativeButtonType>((props, ref) => {
  return (
    <button ref={ref} {...props}>
      버튼
    </button>
  )
})


type ReactSelectProps = React.ComponentPropsWithoutRef<'select'>

interface SelectProps<OptionType extends Record<string, string>>
  extends Pick<ReactSelectProps, 'id' | 'key' | ...>
```

- React는 가상 Dom을 다루면서 이벤트도 별도로 관리한다. 따라서 React의 Event는 브라우저의 고유한 이벤트와 완전히 동일하게 동작하지는 않는다. 기본적으로는 이벤트 버블링 단계에 호출되고, 이벤트 캡쳐링 단계에서 등록하려면 뒤에 Capture라는 단어를 붙여야한다.

```
// 이렇게된다면 일반 Event는 e.target이 없으나, ChangeEventHandler는 리액트 이벤트로 e.target이 존재한다.
// 결국 React Event를 다룰때에 ChangeEventHandler<Tag>를 활용해도 무방하다.

type EventHandler<Event extends React.SyntheticEvent> = (e: Event) => void | null;
type ChangeEventHandler = EventHandler<ChangeEvent<HTMLSelectElement>>
```

- 아래와 같이 선언된 제네릭값을 받아오지 못한다면 받아온 값을 통해 타입을 추론하는 과정을 거친다.

```
interface SelectProps<OptionType extends Record<string, string>> {
  options: OptionType;
  selectedOption?: keyof OptionType;
  onChange?: (selected?: keyof OptionType) => void;
}

const Select = <OptionType extends Record<string, string>>({
  options,
  selectedOption,
  onChange
}: SelectProps<OptionsType>) => {

}
```

- 공변성과 반공변성
  - 공변성: 타입 A가 B의 서브타입일 때, T<A>가 T<B>의 서브타입이 된다면 공변성을 띠고있다.
  - 반공변상: 타입 A가 B의 서브타입일 때, T<B>가 T<A>의 서브타입이 된다면 반공변성을 띠고있다. (함수의 매개변수에서만 가능)

```
interface Props<T extends string> {
  onChangeA?: (selected: T) => void;
  onChangeB?(selected: T): => void;
}

  const onChange = (selectedApple: 'apple') => { // ... }

  // --strict 모드에서
  // onChangeA - 에러 : 이는 화살표 표기법을 사용하면 반공변성을 띠기 때문
  // onChangeB - 정상 : 이는 함수타입을 지정하면 공변성, 반공변성을 다 가지고있는 이변성을 띠기 때문
  // 결국 화살표함수로 정의하는 것이 올바르다.


  // 공변성
  interface User {
    id: string
  }

  interface Member extends User {
    nickName: string;
  }

  let users: Array<User> = []
  let members: Array<Member> = []

  users = members // OK
  members = users // Error

  // 반공변성
  type PrintUserInfo<U extends User> = (user: U) => void

  let printUser: PrintUserInfo<User> = (user) => console.log(user.id)
  let printMember: PrintUserInfo<Member> = (user) => console.log(user.id, user.nickName)

  printMember = printUser // OK
  printUser = printMember // Error (nickname이 없음)
```

- useState를 통해 초깃값을 설정해줄 때, 일반적인 값을 넣어준다면 이는 렌더링마다 값이 다시 계산되거나 새로운 객체를 생성한다. 하지만 초깃값에 값을 생성하는 함수를 넣어줄 경우 이는 최초 렌더링 시에만 함수호출을 통해 계산해주고 이후부터는 함수를 실행하지 않아 리렌더링 이슈에서 벗어날 수 있다. (초기 상태를 지연 초기화 (Lazy Initialization)하는 방식)

```
// re-calculate
const [state, setState] = useState(initialValue)

// calculate at first time
const [state, setState] = useState(() => compute())
```

- props로 전달받은 값을 state의 초깃값으로 넣는 경우 prop의 값이 변경되어도 state가 변경되지 않는다. 이는 컴포넌트가 마운트될 때 한번만 해당 값을 받아서 설정하고 이후에는 독자적으로 관리하기 때문이다. 따라서 SSOT (Single Source Of Truth)를 지켜 한곳에서 관리하는 것이 좋다.
