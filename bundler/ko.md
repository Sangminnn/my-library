# transpiler, bundler

- 기본적으로 babel은 설계 의도 상 한번에 하나의 파일만 트랜스파일링 하도록 되어있다, rollup, esbuild, swc의 경우는 이와 다르게 여러개의 파일을 작업한다.

- babel은 구조 상 단독으로 tree-shaking을 수행할 수 없고, 이를 수행하기 위해 terser plugin이 필요하다. 따라서 terser의 주역할인 불필요한 코드제거에 따라 babel을 통한 tree-shaking의 원리는 Dead Code Elimination이다. 이는 구조상 먼저 babel을 통해 하나의 파일에 대해 transpile을 수행하기에 이러한 과정을 거쳐 나온 최종 번들파일에서 terser가 수행되기때문에 당연한 원리이고, Rollup의 경우 여러개의 파일을 한번에 작업할 수 있기 때문에 전반적인 프로젝트의 의존성을 파악할 수 있고, 이를 통해 Tree Sahking이 수행되는데 이는 필요한 코드를 판단하는 것에 포커스가 맞추어져있는데 이는 전반적인 의존성을 알고있기에 전반적으로 추상구문트리를 생성하여 모든 모듈에 대한 트리를 만들고, 이를 기반으로 실제 사용되는 코드를 식별하고 표시하여 나머지 코드를 제거하여 Tree Shaking이 적용된 상태로 번들링을 수행하는 것이다.
