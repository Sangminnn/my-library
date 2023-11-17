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
