# cross-browsing

- ios safari 15버전 이하에서 overflow-x: auto 와 같이 스크롤이 활성화될 수 있도록 하는 css attribute가 들어갔을 때 스크롤 이벤트를 일으키는 동안에 활성화된 스크롤 영역 이외에 다른 영역도 스크롤이 되면서 bouncing되는 현상이 있다. 처음에는 이 현상을 해결하기 위해 touch-action: pan-x 를 통해 x영역에서의 이벤트만 가능하도록 막아보았으나, 스크롤 이벤트 도중 다시 해당 영역을 클릭 후 허용하지 않은 영역 (y축)으로의 이동을 할 경우 간헐적으로 위의 문제가 재현되는 상황이 발생되었다. 결국은 팀원분이 주신 의견으로 이를 해결하기 위해 움직여서는 안되는 축(y축)을 막는 overflow-y: hidden 을 같이 넣어주니 해당 이슈가 재발하지 않았다.