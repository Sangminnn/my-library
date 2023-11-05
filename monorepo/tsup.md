# tsup

- tsup은 esbuild를 기반으로 TS 라이브러리를 별도의 configuration없이 번들링할 수 있도록 도와주는 번들러이다.

- 기본적으로는 해당 명령어 뒤에 번들링하고자하는 entry경로를 작성해주고 실행하면 번들링이 진행된다.

```
tsup [target file path]
```

- tsup을 custom해서 사용하기 위해서는 **tsup.config.ts** 와 같은 파일에 configuration을 정리해두어야한다. 혹은 package.json에 tsup이라는 key에 대한 value로 defineConfig안의 config 내용을 작성해도 무방하다.

- config 파일의 기본적인 포맷은 아래와 같다.

```
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
```

- 위의 코드포맷에서 특정 옵션을 조건부로 렌더링하고자하는 상황이 있다면 아래와 같이 어떤 option의 유무에 따라 의존성을 부여할 수 있다.

```
import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    minify: !options.watch,
  }
})
```

- tsup의 기본 transpile target version은 es2020이지만. `--target es5`로 특정하게 es2015를 Target으로 한다면, 이는 esbuild에 의해 es2020으로 먼저 transpile된 이후 swc에 의해 es2015로 transpile된다.
- **dts** 옵션은 번들링파일에 대한 type declaration인 d.ts 파일을 만들어줄것인지에 대한 옵션이다.
- **format** 옵션은 번들링파일의 포맷을 CommonJS 방식으로 할지 ES Module 방식으로 할지 정하는 옵션이다. (cjs, esm 둘다 작성할 경우 두 포맷으로 만들어준다.)
- **splitting** 옵션은 코드스플리팅을 할지에 대한 옵션으로 module 특성 상 esm에서만 유효하며, default가 true이다.
- **clean** 옵션은 번들링 실행 시 기존의 파일들을 전부 clear할지에 대한 옵션으로 무결함을 보장할 수 있지만, 증분빌드에 비해서는 속도가 느릴 수 있다.
- **interop** 옵션은 CJS, ESM 중 어떤것과 잘 호환하도록 변환할것인지를 정한다. default는 ES module과 잘 동작하도록 하며, 다른 모듈시스템과의 호환성도 어느정도 보장하고, `'all'` 옵션을 사용한다면 번들링된 코드가 다른 모듈시스템 전부와 호환될 수 있도록 하지만 호환성을 위해 코드양이 늘어나기때문에 번들링된 코드의 크기가 늘어난다.

- 이는 CJS포맷을 ESM형식으로 import할때 문제가 발생하는데, 또한 import 하려는 대상의 타입이 Object가 아닌 경우에는 `*` 를 사용하여 import하는 별칭을 활용한 import는 ESM 포맷에 호환이 안된다. 이를 해결해주는것이 위의 옵션이며 tsconfig에서의 esModuleInterop도 동일한 역할을 하는것으로 보인다. 해당 옵션을 활용하면 변환과정에서 import 가능한 형태로 바꿔준다.
