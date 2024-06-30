# React

- React를 활용하면서 Namespace에 컴포넌트를 할당하는 방식을 사용할 때, NameSpace에 바로 함수 컴포넌트를 작성한다면 일반적인 케이스에서는 정상적으로 렌더해준다. 하지만 특정 상황에 따라 해당 컴포넌트에 hook이 필요한 경우가 생긴다면, React는 이를 React Componenet나 hook 둘 중 어느것으로도 인지하지 않기때문에 사용할 수 없다는 에러 메시지가 나온다. 이러한 경우를 대비하기 위해 별도로 컴포넌트를 선언하고, 이후 해당 컴포넌트를 코어 컴포넌트의 Namespace에 직접 할당해주는 방식을 사용하는 것이 좋다.

```
// don't

Component.NameSpace = () => {
  return ( <div>...</div> )
}


// do

const ComponentNameSpace = () => {
  return ( <div>...</div> )
}

Component.NameSpace = ComponentNameSpace
```

- CRA환경에서 global type을 선언해주기위해서는 **react-app-env.d.ts** 를 활용해야한다. 이와 동일한 맥락으로 vite에서는 **vite-env.d.ts**를 활용해주어야한다.

- 개발을 진행하다보면 Page안에서 섹션 단위로 컴포넌트를 나누게되고, 이러한 컴포넌트들에 속하지 않는 page단의 View 코드가 생길 수 있음. 일반적으로는 문제가 없을 수 있으나, page단의에서 setter를 두어 re-render를 트리거하는 경우 다른 컴포넌트들도 불필요하게 렌더링될 수 있기때문에 Memoization을 잊지말고 해주어야한다.

- 다만 Memoization은 기본적으로 useCallback, useMemo를 사용할 때 Render Phase는 거치고, 의존성 내에서 변경이 감지되지 않아 메모이제이션 된 데이터를 반환해도 된다는 것이 확정되면 캐싱된 return값을 반환해주는 개념이기때문에 연산이 추가될 수 밖에 없다. 이와 다르게 React.memo를 활용하는 경우에는 props을 Shallow하게 비교하여 변경사항이 감지되지 않으면 Render Phase 자체를 수행하지 않는다. 이러한 이유로 useCallback이나 useMemo는 일반적으로 모든 상황에 사용하기보다 특정 함수나 값이 자식 컴포넌트에서 의존성으로 사용되거나 React.memo에 전달되는 값인 경우이다. 두번째 케이스의 경우 Shallow하게 비교를 수행하는데 함수의 경우 매번 다른 참조값으로 인지하여 메모이제이션이 유효하게 동작하지 않기 때문이다.

```
// useMemo는 아래와 같은 개념, useCallback은 cachedValue가 반환하는 값이 함수 실행값이 아닌 함수 자체일 뿐이다.
let cachedValue;

const useMemo = (callback) => {
  if (!dependenciesEqual()) {
    cachedValue = callback(); // 여기가 useCallback일때에는 callback
  }

  return cachedValue;
};
```

- 함수 컴포넌트는 근본적으로 클로저로 동작한다. 이를 setTimeout을 통해 내부 state를 바라보도록 하고 실행한다면 하나의 스냅샷처럼 동작하여 그 당시의 state를 나타낸다. 하지만 과거의 클래스형 컴포넌트는 immutable한 props를 this를 통해서 접근하기때문에 가장 최신값을 기준으로 반환하게 된다.
