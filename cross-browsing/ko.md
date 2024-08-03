# cross-browsing

- ios safari 15버전 이하에서 overflow-x: auto 와 같이 스크롤이 활성화될 수 있도록 하는 css attribute가 들어갔을 때 스크롤 이벤트를 일으키는 동안에 활성화된 스크롤 영역 이외에 다른 영역도 스크롤이 되면서 bouncing되는 현상이 있다. 처음에는 이 현상을 해결하기 위해 touch-action: pan-x 를 통해 x영역에서의 이벤트만 가능하도록 막아보았으나, 스크롤 이벤트 도중 다시 해당 영역을 클릭 후 허용하지 않은 영역 (y축)으로의 이동을 할 경우 간헐적으로 위의 문제가 재현되는 상황이 발생되었다. 결국은 팀원분이 주신 의견으로 이를 해결하기 위해 움직여서는 안되는 축(y축)을 막는 overflow-y: hidden 을 같이 넣어주니 해당 이슈가 재발하지 않았다.

- 일반적으로 ios safari의 하위버전을 호환하기 위한 코드가 많았는데, css rotate의 경우에는 ios safari에서는 하위버전도 잘 호환이 되는 반면, aos환경에서의 기본브라우저가 크롬인 경우 크롬 버전은 비교적 최신버전인 104버전까지만 지원한다. 따라서 동일 역할을 수행할 수 있는 transform의 rotate를 사용하면 하위버전까지 대응이 가능하다

- ios safari에서는 16버전 이후로는 button tag의 default font color가 명시되어있지 않다면 blue컬러로 변환한다. 따라서 button tag 사용시에는 default color를 지정해주어야함. (14.4버전에서는 재현 X)

- ios safari에서는 저전력모드가 켜져있을 경우 웹뷰환경에서의 비디오 자동재생이 불가능하게 막혀있다. 별도로 터치이벤트에 대한 eventListener를 달아두고, 이를 직접 터치했을 경우에는 실행이 되지만 스크립트로 이벤트를 일으킬 경우에는 동작하지 않는것을 보니 event의 read-only속성인 isTrusted를 체크하고있는것으로 보임.

- 추가적으로 IOS 디바이스에서 저전력모드가 켜져있을 경우 다음과 같은 제약이 있다.

  - CPU Throttling (60% 제한)
  - Background Application Refresh 제한
  - WebView Video play제한 (위에 언급한 이슈)
  - auto-download 제한
  - GPU performacne 저하 (requestAnimationframe등의 효과 제한)
  - 화면 밝기 저하

- 기본적으로 px(pixel)은 화면을 구성하는 가장 기본이 되는 단위이기때문에 0.5는 표현할 수 없다.

- iOS 웹뷰는 기본적으로 Webkit기반의 브라우저를 사용하고있고, Android는 Chromium기반의 브라우저를 사용하고있다. Chromium과 Webkit는 기본적으로 렌더링 엔진이 다르기때문에 위와 같은 방식을 마주하는 경우 px에 대한 처리정책이 달라 다르게 표현될 수 있다. 만약 0.5px을 적용하는 경우 이에 대한 근사치로 계산을 하는데 iOS에서는 디스플레이 보정이 더욱 엄격하기때문에 이러한 차이가 더 눈에 띌 수 있다. 따라서 웹뷰환경에서 0.5px을 구현하고자한다면 이는 실제로 픽셀값을 그대로 주는 것이 아닌 우회하는 방법을 사용해야 정확하게 적용되는데, 일반적으로는 아래와 같이 한다.

```typescript
const StyledDivider = styled.hr`
  margin: 15px 0;
  width: 100%;

  // height를 1px로 주고 이에 대한 scaleY를 0.5로 조정하여 0.5px로 만들어준다.
  // 이렇게 한다면 렌더링 엔진이 관여하는 px처리는 1px로 처리하여 엔진별 차이가 없고
  // GPU에서 처리하는 transform 옵션을 사용하여 일관성있게 처리할 수 있다.
  height: 1px;
  transform: scaleY(0.5);
  transform-origin: 50% 100%;

  background-color: ${({ theme }) => theme.color.gray400};
`;
```
