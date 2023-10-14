# WebGL

3d모델은 기본적으로 glTF(GL Transmission Format)이라는 포맷으로 저장함

3D 모델은 source를 주입해주면 바로 그려주는 img, video와 달리 해당 모델을 가지고 그려주기 위해 canvas가 필요하다.

또한 기본적으로 이러한 모델 데이터는 인코딩되어있기때문에 Threejs와 같은 3D형식의 로드 및 디코딩을 지원하는 라이브러리를 사용해주어야한다.

3D 모델의 종류는 여러가지 있는데 그 중 polygonal mesh 형태의 모델이 가장 많이 사용된다.

### 형태(Geometry)

polygonal mesh를 구성하는 데이터는 크게 **형태(Geometry)**, **재질(Material)**, **동작(Animation)** 으로 나누어지며 기타 부가적인 요소가 존재

Polygonal Mesh는 **정점(Vertex)**, 정점을 잇는 **선(Edge)**, 그리고 선들이 합쳐져 만들어지는 **면(Face)**로 이루어져있음.

→ 점, 선, 면으로 이루어져있음.

점 하나를 이루는 데이터는

- **위치** : 3차원 좌표(x, y, z)
- 텍스처 데이터를 매핑하는 UV좌표
- **색상** : 3차원 데이터 (r, g, b)
  - RGBA는 Red, Green, Blue, Alpha의 약자로 빛의 3원색과 투명도를 나타내는 Alpha가 합쳐진 단어이다.
  - Alpha값이 투명도를 나타내기때문에 픽셀별 유효성을 검증하려고하는 경우에는 해당 값을 척도로 검증할 수 있다. (canvas에서는 rgba를 getImageData 메서드를 사용해서 배열로 받아올 수 있음.)
- **벡터** : 법선 방향을 나타냄

### 재질(Material)

3D 모델의 색상, 빛이 비춰졌을때의 특성과 같이 모델 표현의 성질을 나타내기 위한 요소

→ JPG, PNG, WebP와 같은 이미지 형태로 이루어진 텍스쳐(Texture)가 사용된다.

### 동작(Animations)

3D 모델을 움직이게 하기 위해서는 일반적으로 내부에 뼈대를 심어 뼈대를 움직이는 Skeletal Animation 방식을 사용

---

### glTF(GL Transmission Format)

3D 모델을 저장하는 형식 중 하나로 아래 3가지로 구성되어있음.

- JSON형식의 glTF 파일
- 형태 및 동작등의 버퍼 데이터가 저장되는 바이너리 파일 bin
- 다수의 텍스쳐 이미지

### Geometry 최적화

- 폴리곤 개수 감소 - 정점 및 폴리곤 개수를 감소하여 데이터 양을 줄임.
- Geometry Compression - 데이터 압축

**Polygon(폴리곤)** - 3D 그래픽에서 면의 조합으로 물체를 표현할 때의 각 요소

기본 glTF모델에 extension을 더해서 사용하는 경우가 많다.
