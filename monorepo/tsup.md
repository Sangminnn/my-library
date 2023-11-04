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

- **dts** 옵션은 번들링파일에 대한 type declaration인 d.ts 파일을 만들어줄것인지에 대한 옵션이다.
- **format** 옵션은 번들링파일의 포맷을 CommonJS 방식으로 할지 ES Module 방식으로 할지 정하는 옵션이다. (cjs, esm 둘다 작성할 경우 두 포맷으로 만들어준다.)
- **splitting** 옵션은 코드스플리팅을 할지에 대한 옵션으로 module 특성 상 esm에서만 유효하며, default가 true이다.
- **clean** 옵션은 번들링 실행 시 기존의 파일들을 전부 clear할지에 대한 옵션으로 무결함을 보장할 수 있지만, 증분빌드에 비해서는 속도가 느릴 수 있다.
