# SVG

- d : d는 Paths Data에 대한 약자로 도형의 모양을 그리는데에 사용되는 속성이다. 이 안에서 사용하는 값들은 전부 벡터값으로 ${action}${point} 의 조합을 통해 좌표에서의 동작을 표현하는 방식이다.

  - M, m(moveTo): 캔버스에 펜을 그림을 그리기 시작할 위치로 이동시키는 것에대한 명령어로서 M은 절대좌표 위치 이동, m은 상대좌표 위치 이동을 표현한다.

  - Z, z(closepath): 이는 패스 그리기를 종료한다는 명령어로서 그리기가 종료된다면 현재점에서 시작점까지 직선을 그린다. 이는 대소문자 역할이 동일하다.

  - 선 그리기 (lineTo)

    - L, l: 이는 현재 점에서 다음 점까지 직선을 그리는 명령어로, 이 역시 대문자는 절대좌표, 소문자는 상대좌표를 의미한다.

    - H, h: 현재 점에서 수평선을 그리는 명령어로, 대소문자 역할은 위와 같다.

    - V, v: 현재 점에서 수직선을 그리는 명령어로, 대소문자 역할은 위와 같다.

  - 커브 그리기 (curve)

    - C, c: 이는 3차 베지어 곡선에 대한 명령으로 시작점을 기준으로 ${첫번째 컨트롤 포인트}${두번째 컨트롤 포인트}${끝점} 과 같은 형태를 가지고, 시작점과 끝점을 두가지의 컨트롤 포인트를 기준으로 휘게 만드는 형태를 가질 수 있도록 한다. (ex, C35,30 80,0 120,55)

    - S: 이는 시작점과 끝점을 기준으로 특정한 기준점을 잡아 해당 점을 기준으로 한 선의 제어점을 다른 선의 제어점과 반대방향으로 그어지게 만들어 반사된 형태를 만들어 준다. (ex, S 150 150, 180 80), 해당 시점을 기준으로 그려진 접선을 이어 반대방향에도 해당 경사를 유지할 수 있도록 하는 역할로 보임.

    - Q: 이는 2차 베지어 곡선에 대한 명령으로 시작점과 끝점을 기준으로 하나의 컨트롤 포인트만을 가지고 곡선을 만들어준다. (ex, Q60,75 100,50)

    - T: 2차 베지어 곡선에서 S와 같은 역할을 하는 명령어이다.

  - 호 그리기 (Arc)

    - A, a: x, y축 반지름이 주어졌을 때, 두 점을 연결하는 타원을 만들어주는 명령어. `${x축 반지름}${y축 반지름} ${x축 회전각} ${큰 호 플래그} ${쓸기 방향} ${x}${y}` 의 형태를 가진다. (ex, A20,20 0 1,1 50,25) 여기서 큰 호 플래그는 시작점과 끝점을 기준으로 호를 그린다면 짧은 호와 긴 호가 나오기때문에 이를 가리키는 플래그이다.