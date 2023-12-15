# React-Query

- React-Query의 queryCache에 onSuccess, onError를 사용하면서 useQuery의 콜백 onSuccess, onError를 같이 사용한다면 queryCache에 작성된 콜백을 먼저 실행하고, 이후에 사용처의 콜백함수가 실행된다.
- React-Query의 useMutation에는 함수실행 후 반환해주는 mutate의 onSuccess와 useMutation 선언 시에 바로 주입해줄 수 있는 onSuccess가 있다. 이 둘은 미세하게 차이가 있는데, mutate의 onSuccess는 지면에서 사용하는 onSuccess이기때문에 특정 상황에서는 정확하게 실행되지 않을 가능성이 있다고 한다. 따라서 반드시 실행되어야하는 콜백함수라면 useMutation의 선언 시에 주입해주는 것이 좋다.
- React-Query를 활용하는 패턴 중 특정 액션시에만 useQuery를 호출해야만 하는 경우 enabled를 false로 주고, 특정 액션을 트리거로 refetch 하는 방식을 사용하기도 하는데, 이 방식을 사용할 때 쿼리에서 특정 액션으로부터 데이터의 변화를 일으킨 후 바로 refetch를 하게되면 유효하지 않다. 이는 query가 렌더된 시점을 기준으로 상태를 가지고있기때문에 비동기배치 이후 다시 렌더된 시점이 되어야 data가 최신화되어, useEffect를 활용하여 이 문제를 해결할 수 있다.

```
// 변경된 데이터가 적용되지 않음.
const onClick = () => {
  setState('new')
  retchQuery()
}

// state가 변경된 이후에 호출하기때문에 정상적으로 변경된 데이터가 적용된다.
useEffect(() => {
  refetchQuery()
}, [state])
```

- React-Query에서 useMutation을 사용할 때 mutationKey를 지정하지 않더라도 일반적으로는 문제가 생기지 않는다. 다만 이를 사용하는곳에서 re-rendering이 일어날때 mutationKey가 명시되어있지 않다면 식별자가 없기때문에, 이 함수 자체가 새로 생성되는 문제가 있어 항상 mutationKey를 명시해주는 것이 좋다.

- React-Query의 useQuery에서 refetchOnWindowFocus옵션은 false를 제외 true, always가 나누어져 있는데, true라면 staleTime 내에 있다면 네트워크 재요청을 하지 않도록 하고, always라면 staleTime에 관계없이 항상 네트워크 재요청을 하도록 한다. 또한 refetchInterval은 true, false만 존재하며 true인 경우 별도 체크 없이 항상 네트워크 재요청을 한다.
