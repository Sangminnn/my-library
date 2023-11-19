# Browser Rendering

### Parsing

- 서버로부터 받아온 HTML파일을 Main Thread에서 브라우저가 해석할 수 있는 DOM Tree로 변환하는 작업. 이는 async, defer 가 없는 sciprt tag를 만나기 전까지 진행
- CSS는 **외부의 CSS가 불러오기 전에 잠시 스타일이 적용되지 않은 웹 페이지가 나타나는 현상인 FOUC(Flash of unstyled content) 를 방지**하기 위해 **파싱을 멈추고 진행**한다.
- Script tag는 HTML에 직접적으로 영향을 줄 수 있기때문에 사이드이펙트 방지를 위해 Block
- 이렇게 block되어 지연되는 경우 중요한 부분은 preload를 주어 병렬적으로 먼저 처리할 수 있도록 한다.

### Style

- DOM Tree 파싱 이후 CSS를 파싱하여 DOM노드의 스타일을 계산 (스타일 관련 코드 전부 스캔, 단위 변환, 계산)

### Layout

DOM Tree와 StyleSheet를 통해 어떤 요소를 어디에 렌더링해야하는지를 결정 (display: none은 제외한다.) 이때 Layout Object로 구성된 Layout Tree를 만들어낸다.

### Pre-Paint

이전 단계인 style, layout에서 변화가 생겼는지 감지하고 기존에 가지고있는 paint기록을 무효화할지를 결정한다. (**Property Tree** = **각 레이어에 할당되는 속성)**

transform, opacity등의 속성을 적용할 경우, Property Tree에 반영 및 레이어 합성 시 필요한 효과를 빠르게 적용

→ 실제로 그리는 정보에 대한 것을 정리하는 paint 단계 이후 여기서 후처리가 들어가는 부분을 합쳐주는 방식으로 속도를 향상시키는듯함.

### Paint

화면을 그리는 과정이 아니라 **어떻게 그려야할지에 대한 정보**를 담고있는 **Paint Record**를 생성한다. Paint Record는 아래 3가지에 대한 정보를 가지고있다.

- action (ex. Draw)
- position
- style

### Layerize

Paint과정의 결과물을 사용해서 Compoisited Layer List 라는 데이터를 생성.

Layout단계에서 생성된 Layout Object 중 특정 조건을 가지고있다면 Paint Layer를 생성해준다.

**Painter Layer Trigger - 주로 그려주는 시점에서 고려되어야하는 부분이 포함되어있는듯함**

- 해당 tag가 최상위 요소일 경우 (root element)
- `position: relative` 나 `absolute` 인 경우
- 3D속성을 가지고있을 경우 ( `translate3d`, `perspective` … )
- `<video>`, `<canvas>` 태그인 경우
- `CSS filter` 나 `alpha mask` 를 사용하는 경우 ( 명도에 관여하는 경우로 보임 )

이때 Layout Object로부터 Paint Layer가 생성되지 않은 Object는 인접한 Paint Layer와 대응된다. ( Paint Layer와 Layout Object가 1:N 매칭이 가능)

이후 Paint Layer 중 Compositting Trigger인 특정 속성을 가지고있거나, 스크롤 가능한 컨텐츠가 있는 경우 별도의 Graphics Layer가 생성된다.

**Compositing Trigger - 주로 변화하는 시점에서 고려되어야하는 부분이 포함되어있는듯함**

- 3D 속성을 가지고있는 경우 ( `translate3d`, `translateZ` … )
- `<video>`, `<canvas>`, `<iframe>` 태그인 경우
- `position: fixed` 인 경우
- `transform`, `opacity animation`을 사용하는 경우
- `will-change` 속성이 있는 경우
- `filter` 속성이 있는 경우

**분리된 Graphics Layer의 장점**

→ 이후 Viewport의 변화에 따른 픽셀화 과정을 다시 실행하지 않고 GPU연산으로 처리가 가능하여, 향상된 스크롤링과 애니메이션이 가능하다.

### Commit

Layerize단계로부터 출력된 **Composited Layer List**와 PrePaint단계에서 생성된 **Property Tree**를 **메인스레드 → 합성 스레드로 복사**한다.**(이를 Commit이라고 한다.)** 해당 단계까지가 Main Thread에서 일어나는 일이기때문에 이후 JS를 실행 혹은 렌더링 파이프라인을 다시 실행할 수 있다.

**스레드 기반으로 작업을 분리한 이유**

→ 메인 스레드와 합성 스레드가 처리하는 일을 나누어 이를 병렬적으로 처리할 수 있도록 하기위함

---

## Compositing Thread

**overview - 레이어를 합성 및 사용자의 입력(event)을 처리한다.**

- **픽셀화** - 기존에 받아온 정보들을 바탕으로 픽셀 값을 도출해낸다.
- **합성** - 웹 페이지의 각 부분을 레이어로 분리 및 별도로 픽셀화를 해두고, 페이지를 스크롤 하는 등 변화가 생기면 각 레이어를 조정하여 새로움 프레임을 합성해준다.

또한 **스크롤 가능 영역은 Composited Layer로 분리**되어, 이곳에서 발생하는 **스크롤 이벤트는 메인 스레드를 거치지 않고 처리가 가능**함

→ 단, 스크롤 이벤트로부터 Main Thread의 개입이 필요한 부분이 있는데 이는 JS에서 제공하는 preventDefault이다.(**JS의 실행은 Main Thread의 영역이기 때문**) 스크롤 이벤트가 발생하면 자체 Event를 Block할지에 대한 해당 옵션을 체크하는 작업이 필요한데, 이 작업을 skip하겠다고 명시하는 passive 옵션을 사용하면 Main Thread를 거치지 않고 스크롤 이벤트를 동작시켜 더 빠르게 동작시킬 수 있다.

### Tilling (타일링)

위의 개요에서 정리한 바와 같이 Compoisite Thread는 Main Thread로부터 받아온 Layer를 **픽셀화** 한다. 이때 레이어의 크기가 클 수 있기때문에 레이어를 타일 형태로 분할한다.

### Raster

타일링 단계로부터 분할된 layer tile에 저장된 draw명령어를 실행한다. (GPU프로세스에서 수행되는것 - 하드웨어 가속)

Draw명령어를 실행한다면 모든 타일을 픽셀화하고, 타일이 어떻게 그려질지에 대한 정보가 Quad라는 데이터로 생성된다.

### Activate

**Raster과정을 거친 Quad들은 Compositor Frame이라는 데이터로 묶여 GPU 프로세스로 전달된다.**

합성 스레드는 Pending Tree와 Active Tree를 가지고 Swap하는 형태의 멀티 버퍼링 패턴을 가지고있음.

따라서 래스터 작업은 비동기로 진행된다. (새로운 커밋을 보여주기 전 이전 커밋을 보여주어야하기때문)

### Display

GPU 프로세스에서 Activate단계로부터 받아온 여러개의 Compositor Frame을 하나로 합치고 화면에 렌더링하면서 한 프레임을 그려준다.

**Composite Thread Re-Cap**

메인 스레드로부터 받아온 Layer를 픽셀화한다. 이 과정속에서 레이어가 큰 경우 픽셀화하는데에 오래걸리기때문에 이를 먼저 작은 단위의 타일로 분할한다.

→ commit받은 레이어를 쪼개서(tiling) 래스터화하고 Frame으로 만들어 GPU에 전달하는 것이다.

※ 모든 내용은 soso-dev블로그의 내용인 https://so-so.dev/web/browser-rendering-process 를 참고하여 정리했습니다. (\_ \_)
