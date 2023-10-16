# canvas

- 일반적으로 Canvas를 활용해서 그림을 그릴 때는 beginPath -> moveTo -> lineTo -> stroke 메서드의 순으로 호출한다.
- beginPath는 경로의 시작을 알림
- moveTo는 그림 경로의 시작점을 설정한다.
- lineTo는 목적지 좌표를 설정하는 역할을 한다.
- stroke는 실제로 선을 그리는 메서드이다.
- moveTo는 시작점, lineTo는 목적지이기때문에 lineTo에 들어갈 값은 보통 touches, targetTouches를 활용해서 마지막 터치한 값을 받아서 활용하는 것이 일반적이다.


## touches, changedTouches, targetTouches

- touches : 현재 화면에 있는 모든 터치 포인트를 나타냄
- changedTouches : 터치 이벤트가 발생한 순간 변경된 터치 포인트들을 나타냄
- targetTouches : 현재 이벤트가 발생한 DOM 요소에 관련된 터치 포인트를 나타냄