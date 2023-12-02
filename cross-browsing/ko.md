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
