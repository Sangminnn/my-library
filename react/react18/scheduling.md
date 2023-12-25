# Scheduling

- React에서는 어떻게 Task를 빠르게 Scheduling 할 수 있는지?
  → navigator.scheduler의 postTask도 내부적으로는 Message Channel을 사용하고있는데, React의 Scheduler 코드에도 동일한 코드가 존재하여 확인해보았더니 Scheduler에서는 아래의 순서대로 사용가능여부를 체크하고 실행한다.

1. setImmediate
2. Message Channel
3. setTimeout

- setImmediate의 경우 Node환경이나 오래된 브라우저 환경에서는 존재했지만, 타 브라우저와의 호환성 문제로 deprecated되었다고 한다.

- setTimeout을 사용한다면 일반적으로 모든 태스크가 동기적으로 동작하는 것을 이벤트 루프를 태워 스케줄링할 수 있도록 해주는 데에 이점이 있다. ( 태스크를 잘게 쪼개는 느낌 )

- **setTimeout을 즉시 실행하려고 0ms를 작성**하더라도 이는 실제로 내부적으로 **최소 4ms의 간격**을 스스로 가지게 되는데, **Message Channel을 사용한다면 이를 우회하여 0ms로 매우 빠르게 실행**할 수 있기 때문이다.
