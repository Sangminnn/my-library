# package

- npm, yarn, pnpm이 대표적인 package manager이다.

- npm에서는 특정 디스크 I/O를 일으키기 위해 깊이 우선탐색인 DFS알고리즘을 사용한다. 이는 가장 깊은 노드부터 시작하여 상위노드로 올라가며 의존성을 설치하는 방식으로 서로 다른 패키지에 대해 다른 버전을 필요로 하는 경우 충돌이 발생할 수 있다. 이러한 부분을 해소하기 위해 만든것이 `package-lock.json` 이다.

- yarn은 이를 수행하기 위해 너비 우선 탐색인 BFS알고리즘을 사용한다. 이는 모든 의존성 레벨을 동시에 설치하기 위함이며, `yarn.lock` 파일을 사용하여 의존성 트리를 정확하게 잠그고, 다른 시스템에서도 동일한 의존성 트리를 재현할 수 있도록 한다.

- npm, yarn classic은 패키지를 hoisting하여 평탄화 시키는 과정을 가진다. hoisting하여 평탄화한다는 의미는 node_modules 폴더 하위에 패키지들이 전부 나열된다는 의미이다. hosting하는 과정속에서 기존에는 1 depth로 접근할 수 없던 라이브러리임에도 불구하고, 이를 접근할 수 있게되는데 이를 직접 의존하고 있지 않은 라이브러리를 require할 수 있다하여 유령 의존성이라고 부른다. 이는 반대로 다른 의존성을 제거하게 되었을 때 인지하지 못한 상태로 제거될 수 있다는 점에서 문제를 일으킬 가능성이 있다.

- yarn berry는 이를 해결하기 위한 pnp(Plug'n'play)방식을 제공했는데, 이는 node_modules를 사용하지 않고, cache폴더에 의존성 정보를 zip형태로 저장하여 메모리를 최소화할 수 있고, `.pnp.cjs` 에 의존성을 찾을 수 있는 정보를 기록하여 이를 이용해 디스크 I/O 없이 어떤 패키지가 어떤 라이브러리에 의존하는지, 각 라이브러리는 어디에 위치하는지를 알 수 있도록 한다. 또한 zip파일을 이용함으로써 중복설치를 방지할 수도 있다.

- 의존성을 버전 관리에 포함하는 것을 Zero-install이라고 한다. 이를 통해 저장소를 새로 복제 및 브랜치를 변경하더라도 yarn install을 실행하지 않아도 된다. git clone으로 저장소를 복제했을 때에도 의존성들이 바로 사용 가능한 상태였기때문에 의존성을 설치할 필요가 없다. (.yarn/cache에 zip파일들이 존재)

- pnpm은 기존의 npm, yarn classic에서 하는 방식인 hoisting을 통한 flat한 파일관리 (flat하게 만들면 depth를 타고가지 않아도 되어 디스크 I/O가 줄어 성능이 향상된다.) 방식을 벗어나 기존 패키지들이 가지고있는 nested한 구조를 그대로 유지하면서 실제 설치되는 의존성 패키지들은 디스크에 저장해두고, 이를 가지고올 수 있는 주소인 symlink를 연결해두어 중복 설치를 제거하고 성능을 향상한 방법을 사용한다.

- 위 3가지 패키지는 모두 lock파일을 가지고 있는데, 일단 lock 파일의 정의를 먼저 살펴보면, lock 파일이란 매 설치시 결정적이고 (= 항상 같은 버전을 설치하고) 예측가능한 특성을 보장하기 위하여, 각 버전의 정확한 의존성 버전을 저장하고 있는 파일을 의미한다. package.json은 정확한 버전이 기재되어 있는 것이 아니고, >= 1.2.5와 같은 형식의 버전 범위 aka 시멘틱 버저닝이 존재하기 때문에, lock파일이 없다면 매 설치마다 설치하는 버전이 달라질 수 있다.

- corepack은 node 16 lts 버전부터 정식으로 포함되었으며, npm, yarn, pnpm과 같은 package manager들의 manager라고 볼 수 있다. 이러한 패키지 매니저를 중간에서 관리해주는 layer역할로서 각 패키지 매니저를 별도로 설치할 필요없이 사용 및 변경할 때 유용하다.

- pnpm은 이용 가능한 패키지 버전이 선언된 범위와 일치하는 경우 workspace의 패키지를 참조한다. 하지만 특정 케이스에서는 하나의 패키지가 요구하는 버전이 workspace에 존재하지 않는 경우가 있는데, 이런 경우 존재하지 않아 새로 설치하게 될 경우 불확실한 동작을 야기할 수 있다. 이를 해결하기 위해 pnpm은 `workspace:`라는 프로토콜을 지원하는데 이를 사용하면 로컬 workspace 바깥의 패키지에 있는 작업을 수행하지 않아 위와같은 상황처럼 특정 버전에 대한 패키지가 존재하지 않으면 설치하지 않도록 한다.

- 위와 같은 케이스들이 있기때문에 각 패키지별 의존성 관리를 strict하게 해야함. 이때 workspace에서 버전을 제약하는 방식은 아래의 방식이 있다. 위와 같이 workspace 내 패키지 버전을 비교적 쉽게 관리할 수 있도록 해주는 도구로는 `changesets`이 있다. changesets를 사용하면 배포시마다 패키지별 특정 버전을 정해두어 패키지별 버전관리가 용이하도록 도와준다.

- workspace:\*: 워크스페이스 패키지가 모든 버전을 허용한다는 것을 의미한다. 즉, 워크스페이스의 패키지는 어떠한 버전의 의존성도 수용하고, 최신 버전으로 업데이트됩니다.

- workspace:~: 워크스페이스 패키지가 틸드(~) 범위 내의 버전을 허용한다는 것을 의미한다. 틸드 범위는 주어진 버전을 포함하여 해당 버전과 호환되는 마이너 및 패치 업데이트 버전을 허용한다. 예를 들어, ~1.2.3은 1.2.3 버전을 포함하여 1.2.x 범위 내의 버전을 허용한다.

- workspace:^: 워크스페이스 패키지가 캐럿(^) 범위 내의 버전을 허용한다는 것을 의미한다. 캐럿 범위는 주어진 버전을 포함하여 해당 버전과 호환되는 모든 마이너 및 패치 업데이트 버전을 허용합니다. 예를 들어, ^1.2.3은 1.2.3 버전을 포함하여 1.x.x 범위 내의 버전을 허용합니다.

- `package.json`의 main, module은 아래와 같다.

  - main : 사용처가 cjs 환경일 경우 제공해줄 파일을 정의한다.
  - module: 사용처가 esm 환경일 경우 제공해줄 파일을 정의한다.

- `package.json`의 exports는 사용처에서 어떤 방식으로 접근했을때 어떤 파일을 서빙할지에 대한 스크립트로 import와 require 두가지 방식에 대한 경로를 제공해두면, 사용처에서 어떠한 방식으로 사용하더라도 가지고올 수 있도록 한다.
