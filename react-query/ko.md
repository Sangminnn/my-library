# Tanstack/React-Query

- Tanstack/React-Query의 queryCache에 onSuccess, onError를 사용하면서 useQuery의 콜백 onSuccess, onError를 같이 사용한다면 queryCache에 작성된 콜백을 먼저 실행하고, 이후에 사용처의 콜백함수가 실행된다.
- Tanstack/React-Query의 useMutation에는 함수실행 후 반환해주는 mutate의 onSuccess와 useMutation 선언 시에 바로 주입해줄 수 있는 onSuccess가 있다. 이 둘은 미세하게 차이가 있는데, mutate의 onSuccess는 지면에서 사용하는 onSuccess이기때문에 특정 상황에서는 정확하게 실행되지 않을 가능성이 있다고 한다. 따라서 반드시 실행되어야하는 콜백함수라면 useMutation의 선언 시에 주입해주는 것이 좋다.
- Tanstack/React-Query를 활용하는 패턴 중 특정 액션시에만 useQuery를 호출해야만 하는 경우 enabled를 false로 주고, 특정 액션을 트리거로 refetch 하는 방식을 사용하기도 하는데, 이 방식을 사용할 때 쿼리에서 특정 액션으로부터 데이터의 변화를 일으킨 후 바로 refetch를 하게되면 유효하지 않다. 이는 query가 렌더된 시점을 기준으로 상태를 가지고있기때문에 비동기배치 이후 다시 렌더된 시점이 되어야 data가 최신화되어, useEffect를 활용하여 이 문제를 해결할 수 있다.

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

- Tanstack/React-Query에서 useMutation을 사용할 때 mutationKey를 지정하지 않더라도 일반적으로는 문제가 생기지 않는다. 다만 이를 사용하는곳에서 re-rendering이 일어날때 mutationKey가 명시되어있지 않다면 식별자가 없기때문에, 이 함수 자체가 새로 생성되는 문제가 있어 항상 mutationKey를 명시해주는 것이 좋다.
- Tanstack/React-Query의 useQuery에서 refetchOnWindowFocus옵션은 false를 제외 true, always가 나누어져 있는데, true라면 staleTime 내에 있다면 네트워크 재요청을 하지 않도록 하고, always라면 staleTime에 관계없이 항상 네트워크 재요청을 하도록 한다. 또한 refetchInterval은 true, false만 존재하며 true인 경우 별도 체크 없이 항상 네트워크 재요청을 한다.
- Tanstack/React-Query의 useMutation을 사용할 때 useMutation에 있는 mutationFn이 끝날때까지 호출부에서의 isLoading이 true로 유지되는데, 추가적으로 onSuccess와 onSettled에도Promise가 존재한다면 이에 대한 실행 역시 기다린 후에 isLoading값이 false로 변환되고, 이후에 호출부에 존재하는 mutate에 걸려있는 onSuccess가 실행된다.

> ( 호출부의 mutate실행 -> isLoading값 true 전환 -> useMutation의 mutationFn -> useMutation의 onSuccess -> useMutation의 onSettled -> isLoading값 false 전환 -> 호출부의 onSuccess실행 )

- Tanstack/React-Query의 useQuery와 useMutation은 REST API 관점에서는 GET과 POST, PUT, DELETE, PATCH 와 같이 역할에 따라 구분하여 사용하기도 하지만, 다른 관점에서는 useQuery는 선언형, useMutation은 명령형으로 사용한다는 관점으로도 사용이 가능하다. 즉, GET API를 사용하는 상황에서 특정 상태에 의존해 useQuery를 수행하고, v5부터 deprecated된 useQuery의 onSuccess를 사용하지 못해 부득이하게 useQuery로부터 반환받은 data를 바라보는 Effect를 두어 특정 동작을 핸들링할 수도 있겠지만, useMutation이 반환해주는 mutate를 활용해 보다 응집도가 높은 코드로 만들어 사용할 수도 있게된다.
- 위의 상황에서 한발자국 더 나아가 추가적으로 수행해주어야하는 로직이 존재한다면, useMutation의 onSuccess에 로직을 두어 호출부에서는 useMutation으로부터 반환받은 mutate만 사용함으로써 mutation 역시도 선언적으로 사용하여 특정 로직을 사용할 수도 있고, 이러한 상황에서는 유연성이 떨어지기때문에 여전히 호출부의 mutate에 onSuccess를 두어 명령형으로 추가 액션을 처리하여 서버호출에 대한 액션은 useMutation의 mutationFn에 완벽하게 위임하고, 이를 사용하는 사용처의 mutate의 onSuccess에서 클라이언트 로직을 수행하여 책임을 분리하는 관점도 있기에 프로젝트 상황에 따라 알맞게 사용하는 것이 좋다.
- useQuery에 존재하는 옵션 중 **initialData**와 **placeholderData**가 있는데, **initialData는 캐시에 유지**되어 이 프로퍼티는 **placeholder를 제공할때나 부분적, 완성되지않은 데이터를 대체할때에는 추천하지 않고**, 이런 상황에서는 **placeholderData**를 추천한다.
- 추가적으로 **placeholderData**는 결국 **데이터가 존재하지 않을 때** input의 placeholder처럼 **데이터의 자리에 보여지는 값**이다. 이때 **query의 cacheTime이 0**이라면 이론상 해당 쿼리가 사용되지 않고, 비활성화된 상태일 때 나타나는 것인데 **query의 cacheTime이 0일때에 비활성화 타이밍을 체크하고 데이터를 지워주는 단계는 해당 쿼리가 비활성화되면서 다음에 해당 쿼리가 바로 활성화되는 상황이 아닐 경우**이다. 즉 A지면에서 특정 쿼리를 사용하고 B지면으로 이동하는 과정에서 동일한 쿼리를 사용하고있다면, data는 지워지지않고 api호출을 수행하게되어 변경된 data로 교체해준다. (호출타임 사이에 placeholderData가 나타나지 않는다.) 그렇다는 것은 A지면에서 특정 쿼리를 사용하고 B지면으로 이동하는 과정에서 해당 쿼리를 사용하지 않았다면, 다시 A지면으로 돌아올때에는 cacheTime이 0임에 따라 api호출시에 캐시에서 해당 데이터가 사라져있어 최초에는 placeholderData가 나타나게 된다.
- react-query를 Nextjs와 함께 사용하는 경우 **SSR**에서 **prefetchQuery를 통해 Hydrate해주는 과정**이 필요한데, 이때 **서버와 클라이언트는 동일한 쿼리 인스턴스를 가지고 사용하지 않아도 된다.** 중요한 것은 **prefetch해주고자 하는 Query와 같은 QueryKey를 사용하는 것**과 **Hydrate로 인해 받아온 데이터가 유지될 수 있도록 cacheTime이 0이 아니어야한다는 점**이다.
