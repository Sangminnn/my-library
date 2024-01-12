# common

- 평소에 Number로 형변환을 무의식적으로 하고있었는데, 오픈소스를 보다보니 parseInt형변환을 사용하는 코드도 있는것을 보고 차이를 찾아보기 시작. Number 형변환과 parseInt 형변환의 차이는 둘다 Number타입으로의 형변환이 가능하다면 변환, 불가능하다면 NaN을 반환해주지만 Number와 다르게 parseInt는 인자의 시작이 숫자로 시작하고 다른 문자와 결합되어있는 경우에는 처음부터 숫자범위까지만 형변환을 해준다. (ex. parseInt('100원') -> 100)

- 유니코드(Unicode)는 전 세계의 모든 문자를 컴퓨터에서 일관되게 표현하도록 하는 표준

  - 유니코드 코드 포인트 (Unicode code point) : 유니코드 문자에 부여된 고유한 숫자값.
  - 유니코드 영역 (Unicode block) : 특정 범위의 연속된 유니코드 코드 포인트의 집합
  - 유니코드 평면 : 유니코드 영역을 1차원적인 그룹이라고 볼때, 이러한 그룹들을 또 한번 그룹핑한 것을 2차원적인 개념으로 나열했을 때 평면적 성격을 띈다고 이해. 따라서 유니코드 평면은 특정 유니코드 영역들의 집합으로 각 평면이 나타내고자 하는 영역이 다름.
    - 유니코드 평면은 0~16까지의 평면이 존재하고, 대표적으로 0은 기본 다국어 평면 (Basic Multilingual Plane, BMP)으로 반적인 문자, 기호, 그림문자 및 대부분의 띄어쓰기 문자 등 인간이 사용하는 문자가 이 평면에 존재한다.
    - 유니코드 평면 1은 추가적인 문자를 제공하며, 이모지, 희귀한 문자, 역사적 문자, 기호 및 특수 문자 등이 포함된다.
  - 유니코드 인코딩은 대표적으로 UTF-8, UTF-16이 있으며 UTF-8은 유니코드 문자를 1~4바이트로 표현합니다. UTF-16은 16비트, 즉 2바이트로 유니코드 문자를 표현.
  - 두 인코딩 방식이 서로 다른 바이트 수를 지원하는 이유는 UTF-8은 유니코드의 호환성과 효율성을 강조하기 위해 시작되었고, UTF-16은 BMP를 위한 간단한 고정 길이 방식으로 시작

  - UTF-8은 4바이트까지 지원하는 반면, UTF-16가 지원할 수 있는 한계는 2바이트이기때문에 2바이트를 넘어가는 유니코드 문자를 표현하기 위해서 특별한 규칙을 사용해 4바이트로 표현함.
  - 이 규칙을 Surrogate Pair라고 하고, Surrogate라는 특수한 유니코드 문자를 두 개 이어붙여 32비트로 표현하는 방식
  - Surrogate Pair에서 앞에오는 Surrogate 문자(U+D800 ~ U+DBFF)를 High Surrogate, 뒤에오는 Surrogate 문자(U+DC00 ~ U+DFFF)를 Low Surrogate라고 부르고, 이것이 가능한 이유는 유니코드 영역에서 Surrogate 문자만 모아둔 영역이 있기 때문이다.
  - 이모지에 특정 색상을 입힐 수 있는 이유는 Emoji Modifier가 유니코드 영역에 정의되어있는데, 이를 이모지 뒤에 작성해줄 수 있기 때문

  - ECMAScript 스펙에 따르면 자바스크립트 문자열은 연속된 부호없는 16비트 정수로 일반적으로 UTF-16으로 인코딩 된 값이다. (uFFF0와 같은 값은 미지정된 유니코드 코드포인트이다.)

- glob은 Global Pattern의 약자로 파일 경로나 이름 패턴을 일치시키기 위해 사용되는 문자열 패턴 언어 및 라이브러리의 이름. 파일시스템에서 파일 또는 디렉토리를 검색할 때 사용된다.

- input의 inputMode가 존재하고, 이 중에서 pattern과 함께 inputMode를 지정하여 어떤 유형의 KeyBoard가 올라올지 정의해줄 수 있다. (ios safari 12 버전 이상 호환되어 대부분의 webview 환경을 지원한다.)

- 메인 스레드가 받아온 파일을 파싱하고 이를 브라우저에 적용 가능한 형태로 계산 및 정리하는 과정을 진행한 후에는 작업의 주체가 합성 스레드로 넘어가는데, 그 중 Scroll Event가 발생 시 Viewport에 변화된 화면을 보여주기 위해 계산된 Layer를 계속해서 합성해주는 과정이 있다.

  - 자바스크립트 실행은 메인 스레드가 담당하기때문에 합성 스레드는 합성 과정에서 이벤트 핸들러가 있는 영역은 '고속 스크롤 불가 영역'으로 인지한다.
  - 웹 페이지의 이 영역에서 이벤트가 발생한다면 합성 스레드는 입력 이벤트를 메인 스레드로 보내야하는지를 확인한다. 이 이유는 기본적으로 이벤트가 발생한다면 event가 스스로의 기본동작을 실행하지 않는 preventDefault 동작이 포함되어있는지를 별도로 확인하는 과정을 거쳐야하기 때문이다.
  - 따라서 해당 영역 밖에서 이벤트가 발생했다면 메인 스레드로부터 받은 정보를 바탕으로 다시 메인 스레드를 거치지 않고 바로 합성을 시작한다.
  - passive옵션은 기본동작을 block하는 옵션이 있는지를 메인스레드가 체크해주는 단계를 스킵할지에 대한 여부이다. passive가 true라면 해당 이벤트를 처리하는 과정에서는 preventDefault를 사용하지 않겠다(없는)는 것을 미리 명시하는 옵션이기때문에, 이를 활성화 한 이후부턴 합성 스레드가 처리하는 과정속에서 메인스레드에 preventDefault 여부를 체크하는 일을 하지 않아도 되어 더 빠르게 렌더링을 할 수 있게된다.

- event의 isTrusted 옵션은 사용자에 의해 발생한 이벤트인지 브라우저에 의해 발생한 이벤트인지 판단할 수 있도록 하는 플래그이다.

- `commitlint.config.js` 파일 안에서 rules를 정할 수 있고, rules의 목록은 docs에 있다.

사용법은 룰마다 3가지 인자가 필요한데 이는 아래와 같다.

1. Alert 레벨 - 0: 비활성화, 1: 경고, 2: 에러
2. Applicable - ‘always’, ‘never’로 never는 rule을 뒤집는다고 표현함
3. value - 해당 룰에 대해 적용할 값

```
// example
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'always'],
  },
}

```

- 카카오톡은 url을 누르면 ogUrl로 열어주기때문에 ogUrl 주소를 제대로 입력해주어야한다. 또한 카카오는 카카오톡 공유의 디버거를 제공해주고있음. 한번 조회한 이후부터는 캐시가 남기때문에 이곳에서 캐시를 지워줄 수도 있다.

- 모바일 구글 크롬은 `chrome://inspect` 를 입력해주면 디바이스 내에서 디버깅이 가능하다.

- `list-style: none` 을 사용한다면 스크린 리더가 읽을 때 목록의 의미가 사라져버리기때문에
  - role=”list” 를 같이 사용해준다.

```jsx
<ul style="list-style: none" role="list">
  <li></li>
</ul>
```

- `list-style-type: ‘’` 을 사용한다.

- opacity와 rgba에서의 alpha 값의 차이는 opacity는 해당 엘리먼트의 모든 자식 요소의 명도 값을 지정하는 것이고, rgba는 적용한 element에만 적용된다.

- `a >> b`에서 `>>` 연산자는 a 값을 b비트만큼 이동시키는 연산자이다.

- requestAnimationFrame: 하나의 프레임에서 렌더링 전에 실행된다. 일반 JS 코드 실행에 비해 DOM 트리를 접근하는 작업은 느리고 시간을 예측하기 어렵다.

- requestIdleCallback - 이는 layout - paint 과정 이후 남은 시간에 호출되는 함수로 인자로는 deadline을 받아 이에 대한 메서드인 timeRemaining을 실행하면 다음 렌더링까지 남은 시간을 반환해준다.

- DocumentFragment는 마치 가상 DOM처럼 실제 렌더링 전에는 DOM 에 접근하지 않는다. 따라서 매번 DOM에 접근하여 요소를 변경해주는 document.getElementById().appendChild() 방식보다 훨씬 빠르다. 일반 Element였다면 나중에 타겟 태그 밑에 fragment가 들어가고 그 밑에 30개의 태그가 생기겠지만, DocumentFragment는 자신을 제외한 하위 엘리먼트들만 옮겨준다.

```js
// before
document.getElementById("test").appendChild(elem);

// after
const fragment = document.createDocumentFragment();
document.getElementById("list").appendChild(fragment);
```

- throttle은 이벤트가 연속적으로 발생한다면 처음 이벤트를 실행시키고 지정된 시간동안 이벤트에 대한 실행을 Block한다. 이후 지정된 시간이 지난다면 다시 위의 플로우를 반복한다.

- debounce는 지정된 시간 내에서 연속적으로 이벤트가 발생한다면 발생 시점마다 타이머를 Reset하고 이전에 들어온 이벤트를 지우고 새로 들어온 이벤트를 등록한다. 이러한 과정을 통해 결국 마지막으로 발생한 이벤트만 남고, 지정된 시간이 지나면 마지막으로 발생한 이벤트가 실행된다.

- debounce에는 최초 이벤트 실행을 타겟으로하는 Leading Edge와 위와 같이 마지막 이벤트 실행을 타겟으로 하는 Trailing Edge가 존재한다. Leading Edge의 경우 throttle과 유사하다고 생각할 수 있지만, 지정된 시간 주기 이후에는 이벤트가 한번씩 실행될 수 있는 throttle과 다르게 이벤트가 연속으로 실행되는 시간동안은 지정된 시간과 관계없이 계속해서 실행을 Blocking한다.
