# React-Query

- React-Query의 queryCache에 onSuccess, onError를 사용하면서 useQuery의 콜백 onSuccess, onError를 같이 사용한다면 queryCache에 작성된 콜백을 먼저 실행하고, 이후에 사용처의 콜백함수가 실행된다.
- React-Query의 useMutation에는 함수실행 후 반환해주는 mutate의 onSuccess와 useMutation 선언 시에 바로 주입해줄 수 있는 onSuccess가 있다. 이 둘은 미세하게 차이가 있는데, mutate의 onSuccess는 지면에서 사용하는 onSuccess이기때문에 특정 상황에서는 정확하게 실행되지 않을 가능성이 있다고 한다. 따라서 반드시 실행되어야하는 콜백함수라면 useMutation의 선언 시에 주입해주는 것이 좋다. 
