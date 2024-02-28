# testing

- jest에서 기본적으로 it, test로 테스트 시나리오를 명시할 수 있음.

  - test: if ~~로 작성하여 테스트의 목적이나 수행할 동작을 명시적으로 기술하는데 사용한다.
  - it: test의 alias로 should~~ 로 작성하여 내가 바라는 기대 결과를 정의하는데 사용한다. (어떤 행동을 하면 어떤 결과가 나온다)

- testing library에서 user의 type과 keyboard의 차이

  - 키보드의 버튼을 누르는 시뮬레이션만 하려면 `keyboard()`를 사용
  - 입력 필드나 텍스트 영역에 일부 텍스트를 편리하게 삽입하려는 경우 `type()`을 사용

- 단위 테스트 (Unit Test)는 아래의 경우에만 사용하는 것이 적합하다.

  1. react-hook
  2. 유틸함수
  3. 공통 컴포넌트

- mocking은 특정 라이브러리나 객체에 대해 모듈을 대체하는 개념이고, spy는 특정 동작에 대해서 tracking할 수 있는 요소를 심어두어 이에 대한 호출이 잘 이루어졌는지를 확인하는 방

- mocking은 기본적으로 특정 테스트에 의해 변경될 가능성이 있기때문에 이에 대한 히스토리를 매번 초기화해주어야한다.

  - **clearAllMocks** : 모킹된 모의 객체 호출에 대한 히스토리를 초기화.
  - **resetAllMocks** : 모킹 모듈에 대한 모든 구현을 초기화

- Jest vs Vitest

  - Jest
    - 기본적으로는 초기 설정이 거의 필요하지 않음 (node환경 기준)
    - 스냅샷 테스팅을 지원
    - 테스트 간의 충돌을 방지
    - 모킹이 쉬움
  - Vitest : Vite의 개발 서버와 모듈 리로더를 활용하여 테스트를 실행

    - 테스트 실행 속도가 빠르다
    - ES Module을 기본적으로 지원하여, 별도의 변환이 필요하지 않음
    - Jest의 API를 거의 지원하여 마이그레이션이 용이

  - 정리
    - Vitest가 Jest보다 실행속도가 빠르고 ES Module을 지원하여 변환 단계가 불필요함 (Jest는 babel이나 ts가 필요)
    - Jest는 프로젝트와 통합하기 위해 config가 많이 필요한 반면, Vitest는 간단한 config 추가로 사용 가능
    - Vite와의 통합이 용이함

- jsdom vs happy-dom
  -> 일반적으로 자주 사용하는 API에서는 happy-dom이 최적화를 더 잘해두어 성능이 우수하나, jsdom이 더 오랜 연혁을 가지고있어 에러상황에서 정보가 많고, happy-dom에서는 지원하지 않는 API가 있을 수 있어 비교하고 사용해야한다.

- clearAllMocks vs resetAllMocks
  - `clearAllMocks` : 모킹한 모의 함수의 호출 상태나 반환된 값의 기록을 초기화함. 함수의 구현이나 반환 값을 변경하지는 않고 함수의 호출 횟수나 함께 호출된 인자에 대한 정보를 초기화
  - `resetAllMocks` : clearAllMocks에서 하는 역할을 모두 수행하며 추가적으로 모킹한 함수들의 구현까지 모두 초기화
