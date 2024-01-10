# typescript

- 타입스크립트의 집합관계는 일반적으로 Array와 같은 타입에서는 슈퍼타입과 서브타입의 관계가 일반적인 형태인 하위 타입에서 상위 타입으로의 할당이 가능한 형태를 가지지만, 함수의 인자에서는 반대의 형태인 상위 타입에서 하위 타입으로의 할당이 가능한 형태를 가진다. 이를 전자는 공변성, 후자를 반공변성이라 부른다. 이는 **--strictFunctionTypes** 옵션을 사용한다면 함수 파라미터가 반공변적으로 동작한다. 이변성은 파라미터에서 이 두가지 성격을 다 가지는 것.
- 이에 대해 첨언하자면 타입관점에서는 긴가민가하지만 해당 타입의 범주보다 작은 범주를 할당할 경우, 기존에 선언된 타입에 따라 나머지 범주가 들어오는 경우를 처리하는 케이스가 있을 수 있음. 정적 타입과 동적으로 변하는 타입의 관점에서 생각하면 이해가 된다. 정적인 값을 넣어준다면 문제가 없지만, 기존의 동적 타입을 받아 처리해주는 부분에서는 공변성을 유지하게된다면 런타임에러가 발생할 가능성이 있음. 예를 들어 string | number 를 처리하는 함수에 number 만 처리할 수 있는 함수를 할당하게 된다면 런타임에 타입 문제가 생길 것이 자명하다. 해당 함수는 모든 파라미터를 number 로 보고 처리할텐데 실제로 string 타입까지 들어올 수 있는 것이기 때문이다.
- JavaScript의 Array 인스턴스는 다양한 메서드를 편리하게 지원하기 위해 메서드형태는 이변성을 가진다. (메서드는 일반 클래스 및 인터페이스(예: Array<T>)가 대부분 가변적으로 계속 관련되도록 하기 위해 특별히 제외되었습니다.)
- 줄여쓰기(shorthand) 방식(set(item: T): void;)은 메서드 파라미터를 이변적으로 동작시키기 위한 표기법이고, 프로퍼티 방식(set: (item: T) => void;)은 메서드 파라미터를 반공변적으로 동작시키기 위한 표기법

- ts-pattern을 이용한 패턴 매칭 방식이 있는데, 이는 switch, if-else와 같은 조건부 케이스를 더욱 선언적이고 Type-safe하게 다룰 수 있도록 도와준다. 이를 활용하면 기존의 타입가드를 통해 디테일한 타입을 나누는 동작 없이도 타입을 정확하게 추론해주고, exhaustive 메서드를 활용하면 새로운 타입이 추가될 경우, 케이스에 대한 정의가 되어있지 않다면 이를 런타임 에러로 가드닝해준다.

- react의 useRef는 사용방식에 따라 두가지 타입으로 나뉜다.
  - 제네릭에 **<인자로 들어올 타입 || null>** 이 들어오는 케이스 : 이때는 MutableRefObject타입이 되어 current를 변경할 수 있게된다.
  - 제네릭에 **<인자로 들어올 타입>**을 넣어주고 인자에 **null** 을 넣어주는 케이스 : 이때는 RefObject타입이 되어 current를 변경할 수 없게된다.

```
  function useRef<T>(initialValue: T): MutableRefObject<T>
  function useRef<T>(initialValue: T | null): RefObject<T>
  function useRef<T = undefined>(): MutableRefObject<T | undefined>

  interface MutableRefObject<T> {
    current: T;
  }

  interface RefObject<T> {
    readonly current: T | null;
  }
```

- ref로 넘겨준 타입은 내부적인 타입추론을 통해 ForwardedRef 타입으로 정의되는데 이는 아래와 같다. 이를 통해 ForwardedRef에는 MutableRefObject만 들어올 수 있다는 것을 알 수 있고, 이는 RefObject보다 넓은 범위의 타입을 가지기 때문에, 부모 컴포넌트에서 ref를 어떻게 선언했는지와 관계없이 자식 컴포넌트가 해당 Ref를 수용할 수 있다.

```
  type ForwardedRef<T> =
    | ((instance: T | null) => void)
    | MutableRefObject<T | null>
    | null
```

- 타입가드의 패턴은 아래와 같다.

  1. 특정 타입을 typeof로 가드하는 방식
  2. 특정 인스턴스화된 객체 타입을 instanceof로 가드하는 방식
  3. 객체 내에서 특정 속성이 있는지를 확인하는 in 가드 방식
  4. 반환 타입에 타입 명제인 함수를 정의하여 사용하는 방법 ( A is B , A는 매개변수 B는 타입 )

- ForwardRef의 반환타입은 보통 **ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>** 로 나타난다. 따라서 이는 Ref를 가지고있지 않은 타겟 컴포넌트의 Props와 Ref를 가지고있는 ComponentPropsWithRef의 Ref props를 결합해주면 된다.

```
function forwardRef<T, P = {}>(render: ForwardRefRenderFunction<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
  defaultProps?: Partial<P> | undefined;
  propTypes?: WeakValidationMap<P> | undefined;
}

type Validator<T> = PropTypes.Validator<T>;


type WeakValidationMap<T> = {
  [K in keyof T]?: null extends T[K]
      ? Validator<T[K] | null | undefined>
      : undefined extends T[K]
      ? Validator<T[K] | null | undefined>
      : Validator<T[K]>
  };

interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
  displayName?: string | undefined;
}

interface ExoticComponent<P = {}> {
  (props: P): (ReactElement|null);
  readonly $$typeof: symbol;
}


type TargetComponent = ComponentPropsWithoutRef<T> & ComponentPropsWithRef<T>['Ref']
```
