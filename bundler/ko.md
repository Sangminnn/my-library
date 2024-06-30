# transpiler, bundler

- 기본적으로 babel은 설계 의도 상 한번에 하나의 파일만 트랜스파일링 하도록 되어있다, rollup, esbuild, swc의 경우는 이와 다르게 여러개의 파일을 작업한다.

- babel은 구조 상 단독으로 tree-shaking을 수행할 수 없고, 이를 수행하기 위해 terser plugin이 필요하다. 따라서 terser의 주역할인 불필요한 코드제거에 따라 babel을 통한 tree-shaking의 원리는 Dead Code Elimination이다. 이는 구조상 먼저 babel을 통해 하나의 파일에 대해 transpile을 수행하고 terser가 수행되기때문에 당연한 원리이고, Rollup의 경우 여러개의 파일을 한번에 작업할 수 있기 때문에 전반적인 프로젝트의 의존성을 파악할 수 있고, 이를 통해 Tree Sahking이 수행되는데 이는 실제로 사용되지 않는 코드를 처음부터 작업하지 않는 과정으로 babel의 tree shaking방식과는 다르다.
