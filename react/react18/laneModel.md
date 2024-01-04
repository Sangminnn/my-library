# LaneModel

React 17버전 이상에서 User Event가 발생하는것과 Re-Render의 우선순위가 정확하게 어떻게 되는지?

→ Discrete Event 는 높은 응답성을 유지해야하기때문에 우선순위가 높아 Sync Lane에 속하는듯

- Concurrent Mode에서는 User Events의 우선순위가 높아 일반적으로 이벤트 처리는 즉시 수행됩니다.
- 그러나 Re-render 업데이트가 이미 예약되어 있고, 우선순위가 높다면 Re-render가 먼저 수행됩니다.

기존에는 업데이트를 위한 Expiration Time은 우선순위를 정하고, 이에 대해 한번의 배치에 얼만큼을 처리할지를 정하는 구조였음 (이벤트 우선순위 + 업데이트 발생 시점 기준 계산)

따라서 이때 고려한 것은 아래 두가지였다.

1. 우선순위
2. 배치 여부

하지만 Suspense개념의 등장 이후 위 두가지 요소만으로는 업데이트의 개념이 부족했다.

우선순위가 아닌 다른 이유로 작업의 순서를 결정해야할 이유가 없었다?

기존의 통념을 깨야했던 이유는 IO-Bound 때문 (CPU - IO - CPU 의 순서에서 두번째 CPU-Bound를 IO-Bound가 Block하는 현상 ?)

화면을 전환하는 A, B버튼이 존재하고 사용자도 버튼별 차이점을 알고 있다.

A : 로컬 데이터를 사용하여 UI 전환

B : 네트워크 데이터를 사용하여 UI 전환

IO-Bound는 CPU-Bound보다 느릴 수 밖에 없다. 같은 우선순위를 가진 전환 렌더링이라도 IO-Bound보다는 CPU-Bound를 먼저 처리하는게 유리하다.

### **Q) IO-Bound, CPU-Bound는 무엇?**

**A)** Lane 모델에서 업데이트 개념 분리를 설명할 때 CPU와 IO Bound라는 개념을 언급했습니다. **일반적인 모든 렌더링은 CPU에 의존적이기 때문에 CPU-Bound**에 속합니다. **IO-Bound는 네트워크와 전환이 결합된 경우**에만 해당합니다.

**A2) React에서 IO-Bound에 속하는 것은 Suspense 컴포넌트이다.**

React 18부터는 렌더링의 여러 요소(업데이트 종류, Suspense, Hydrate)에 따라 렌더링 방식을 다르게 가져가야하기때문에 세분화된 업데이트 관리가 필요

아래 두가지 개념을 분리하여 관리함

- **업데이트 간의 우선순위**
  → 사용자 액션으로부터 text 상태를 변경 vs startTransition API를 사용하여 text 상태를 변경
  → 사용자 액션의 응답이 가장 중요하기때문에 렌더링 중이더라도 렌더링을 중단하고 더 높은 업데이트를 기준으로 다시 렌더링한다.
- **업데이트 배치 여부**

업데이트 종류에 따라 렌더링 방식이 다르다.

화면 전환 - 우선순위는 낮지만, 렌더링에 필요한 리소스는 크다.

**사용자의 텍스트 입력에 반응하는 것 vs 텍스트로부터 자동완성 UI를 렌더링하는 것**

→ **Time Slicing**기법을 통해 점진적 렌더링을 진행

Reconciler(렌더링 모듈)은 현재 렌더링 대상인 renderLanes를 들고있고, 해당 Lane에 올라가있는 업데이트들이 배치처리되는 구조

### Lane의 종류

- Sync Lane : 사용자의 물리적 행위 중 개별처리가 필요한 이벤트 (Discrete Event)
  - click, input, mouse down, submit
- InputContinuous Lane : 사용자의 물리적 행위 중 연속적으로 발생하는 이벤트 (Continuous Event)
  - drag, scroll, mouse move, wheel
- Default Lane : 기타 모든 이벤트 및 리액트 외부에서 발생한 업데이트
  - setTimeout, Promise
- Transition Lane : 개발자가 정의한 전환 이벤트 (React 18에서 지원하는 특별 처리방식

### Lane 할당 시점

→ **setState를 일으킬 때**

그렇다면 re-render의 trigger가 나타나면, 이에 대한 Lane을 설정하고 해당 시점 기준으로 렌더링을 진행할 Lane을 선택

- 이때 렌더링이 진행중이더라도 현 Lane보다 높은 우선순위의 Lane이 존재할 수 있음.
- 렌더링 작업은 단일 Lane일 수도 있지만 복수개의 Lanes일 수도 있습니다.
- 같은 종류의 업데이트는 모두 배치처리

전환 업데이트가 다른 시점에 생성되어 다른 Transition Lane에 할당되었어도 항상 배치처리 된다는 의미입니다.

⇒ 여러 Lane중에서 하나 선택인듯, 여러 Lane을 동시에 실행은 X

**suspendedLanes** 는 IO-Bound인 렌더링에서 보류처리된 Lane (네트워크 요청으로부터 데이터가 도착하지 않은)

**pingedLanes** 는 보류된 상태가 해결(네트워크 요청 완료)되었지만 렌더링은 진행하지 못한 Lane

→ suspendedLanes 은 기본적으로 제외 - 요청에 대한 응답이 오지 않았기때문에

→ **pingedLanes 는 CPU-Bound Lanes보다 우선순위에 밀림**

위는 렌더링 시점에 Lane간의 우선순위가 비교되고, 이로 인해 선택된 Lane이 배치처리 되는 것에 대한 설명이다.

이후 wipLane 인 진행중인 Lane을 확인하고, 존재한다면 현재의 Lane 과 우선순위를 비교하여 interrupt 할지에 대해 정함.

### 정리

- Suspense 에 대한 개념이 추가되면서 React 의 멘탈모델에 더 정교한 스케줄링이 필요했고, 이로 인해 기존에는 Expiration Time 가 먼저 들어온 순위와 우선순위에 따라 정해졌다면 이제는 각 Task들에 대한 우선순위가 더 정교하게 비트마스크 자료구조를 가진 Lane개념으로 정리가 되었고, re-render가 발생하면 이 Lane 들중에서 가장 우선순위가 높은 Lane을 선택해 작업을 진행한다. 이때 기존과 다른 부분은 현재 진행중인 Lane이 있을 수 있고, 해당 Lane이 새로 들어온 Lane에 의해 interrupt될 수 있다.

---

### Lane의 또 다른 역할

- Lane은 사실 업데이트에만 할당되지 않음. Lane은 업데이트의 우선순위와 배치 여부로만 해석하는 것이 아닌 업데이트 발생 여부를 판단할 때도 사용된다. 상태가 변경된 fiber에 업데이트가 발생했음을 Lane에 기록, 이후 대상 컴포넌트를 찾아갈때 사용하기도 함
