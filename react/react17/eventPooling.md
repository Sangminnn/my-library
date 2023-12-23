# Event Pooling

- React 17 이전인 기존에는 DOM Node에 직접 부착하던 Event를 Root에 Instance를 부착하는 방식으로 변경 (Synthetic Event)

- 그렇다면 매 사용마다 Instance를 생성 및 해제(GC) 해주는 방식이 필요하기때문에, 이를 Synthetic Event Pool을 만들어 이벤트가 발생할때마다 Pool을 사용하는 방법을 고민

- Event Pool에 Synthetic Event Instance를 준비하고, 이벤트가 트리거된다면 Pool의 인스턴스를 사용해서 Synthetic Event로 래핑해주는 방식을 사용, 이후 이벤트 핸들러가 종료된다면 인스턴스는 초기화되어 Pool로 돌아가는 방식

- 하지만 일반적인 방식에서는 문제가 없지만, 비동기 이벤트의 경우는 추가적인 대응이 필요하기 때문에 이는 직관적이지 않은 경험을 주었기때문에 결국 사라짐.

### Synthetic Event

- 각 이벤트의 목록을 가지고있음
- NativeEvent 이름과 리액트 이벤트 핸들러 Property를 매핑
- Discrete Event, UserBlocking Event, Continuous Event 등 리액트에서 정의한 이벤트 타입에 따라 부여하는 이벤트의 우선순위를 설정

### 실제 이벤트 발생 시나리오

1. Button을 클릭하면 클릭 이벤트를 감지하고, 부착한 이벤트 리스너가 트리거된다. ( Synthetic Event )
2. 넘어온 이벤트 객체로부터 target DOM Node를 식별하고, 어떤 Fiber node 와 매칭되는지 식별
3. Event Bubbling을 위해 해당 Fiber node로부터 root node 까지 순회하며 이벤트 등록 ( dispatch Queue)
4. root node에 도달한 이후, dispatch Queue를 순서대로 실행한다. 이때 각 Listener로부터 propagation 여부를 검사하고 이벤트 중복 여부를 확인
