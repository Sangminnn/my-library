# Event System

## React 17에서의 이벤트 처리방식

기존에는 DOM Node에 직접 이벤트를 부착하던 방식에서 이제는 root에 부착한다.

→ \***\*Synthetic Event\*\***

### Synthetic Event

- 각 이벤트의 목록을 가지고있음
- NativeEvent 이름과 리액트 이벤트 핸들러 Property를 매핑
- Discrete Event, UserBlocking Event, Continuous Event 등 리액트에서 정의한 이벤트 타입에 따라 부여하는 이벤트의 우선순위를 설정

### 실제 이벤트 발생 시나리오

1. Button을 클릭하면 클릭 이벤트를 감지하고, 부착한 이벤트 리스너가 트리거된다. ( Synthetic Event )
2. 넘어온 이벤트 객체로부터 target DOM Node를 식별하고, 어떤 Fiber node 와 매칭되는지 식별
3. Event Bubbling을 위해 해당 Fiber node로부터 root node 까지 순회하며 이벤트 등록 ( dispatch Queue)
4. root node에 도달한 이후, dispatch Queue를 순서대로 실행한다. 이때 각 Listener로부터 propagation 여부를 검사하고 이벤트 중복 여부를 확인
