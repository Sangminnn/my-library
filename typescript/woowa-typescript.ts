// 우아한 타입스크립트를 읽으며 기록할만한 Utility Type을 기록합니다.

type CustomNonNullable<T> = T extends null | undefined ? never : T;

// Promise.all로부터 response | null 이 반환되는 경우
// 특정 key가 존재하지 않는 response를 필터링할 경우 NonNullable 없이는 response | null 타입이 반환된다.
// 이러한 경우를 위해 사용한다.
// ex) shopAds = shopAdList.filter(NonNullable)
function NonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null || value !== undefined;
}

// 특정 객체로부터 key, value쌍을 매칭한다.
// P는 전체객체, T는 P객체의 key들
// 처음 생각한 프로토타입
// key list중 특정 타입을 Exclude하는것
type MyPickOne<P, T extends keyof P> = Record<T, P[T]> &
  Partial<Record<keyof Exclude<T, P[T]>, undefined>>;

// T는 대상객체, P는 대상 객체의 Key값들
/** @description 여러 타입 중 구분자 key없이 각각 다른 key를 구분해내는 유틸리티 타입  */
type AnswerPickOne<T> = {
  [P in keyof T]: Record<P, T[P]> &
    Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];

/** @description Promise.all 시에 내부의 항목들을 추론하기 위한 type */
type UnwrapPromise<T> = T extends Promise<infer K>[] ? K : any;

export class APIResponse<Ok, Err = string> {
  private readonly data: Ok | Err | null;
  private readonly status: ResponseStatus;
  private readonly statusCode: number | null;

  constructor(
    data: Ok | Err | null,
    statusCode: number | null,
    status: ResponseStatus
  ) {
    this.data = data;
    this.status = status;
    this.statusCode = statusCode;
  }

  public static Success<T, E = string>(data: T): APIResponse<T, E> {
    return new this<T, E>(data, 200, ResponseStatus.SUCCESS);
  }

  public static Error<T, E = unknown>(init: AxiosError): APIResponse<T, E> {
    if (!init.response) {
      return new this<T, E>(null, null, ResponseStatus.CLIENT_ERROR);
    }

    if (!init.response.data?.result) {
      return new this<T, E>(
        null,
        init.response.status,
        ResponseStatus.SERVER_ERROR
      );
    }

    return new this<T, E>(
      init.response.data.result,
      init.response.status,
      ResponseStatus.CLIENT_ERROR
    );
  }
}

// 사용코드
const fetchShopStatus = async (): Promise<
  APIResponse<IShopResponse | null>
> => {
  return await API.get<IShopResponse | null>();
};

export interface MobileApiResponse<Data> {
  data: Data;
  statusCode: string;
  statusMessage?: string;
}

const fetchPriceInfo = (): Promise<MobileApiResponse<PriceInfo>> => {
  const priceUrl = "https:~~"; // url 주소

  return request({
    method: "GET",
    url: priceUrl,
  });
};

// exhaustiveCheck를 통해 특정 switch문에서 타입이 다 정의되었고, 모두 케이스별로 할당이 되었는지를 확인할 수 있음. (assertion)
const exhaustiveCheck = (param: never) => {
  throw new Error("type Error");
};

type ProductPrice = "10000" | "20000" | "50000";
const getProductName = (productPrice: ProductPrice) => {
  if (productPrice === "10000") return "1만원권";
  if (productPrice === "20000") return "2만원권";
  // if(productPrice === '50000') return '5만원권' // <- 이와 같이 유니온 내에서 정의되어있지 않은 케이스가 있을 경우 남은 productPrice type이 있기때문에 never와 충돌
  else {
    exhaustiveCheck(productPrice);
    return "상품권";
  }
};
