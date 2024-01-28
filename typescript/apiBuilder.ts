class APIBuilder {
  private _instance: API;

  constructor(method: HTTPMethod, url: string, data?: unknown) {
    this._instance = new API(method, url);
    this._instance.baseURL = apiHost;
    this._instance.data = data;
    this._instance.headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    this._instance.timeout = 5000;
    this._instance.withCredentials = false;
  }

  static get = (url: string) => new APIBuilder("GET", url);
  static put = (url: string) => new APIBuilder("PUT", url, data);
  static post = (url: string) => new APIBuilder("POST", url, data);
  static delete = (url: string) => new APIBuilder("DELETE", url);

  baseURL(value: string): APIBuilder {
    this._instance.baseURL = value;
    return this;
  }

  headers(value: HTTPHeaders): APIBuilder {
    this._instance.headers = value;
    return this;
  }

  // timeout
  // params
  // data
  // withCredentials
  // build

  build(): API {
    return this._instance;
  }
}
