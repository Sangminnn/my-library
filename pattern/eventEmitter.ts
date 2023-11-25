class EventEmitter {
  private _callbacks: { [key: string]: any };

  constructor() {
    this._callbacks = {};
  }

  public on<T extends Object>(eventName: string, callback: T) {
    if (!this._callbacks[eventName]) {
      this._callbacks[eventName] = [];
    }
    this._callbacks[eventName].push(callback);
  }

  public off<T extends Object>(
    eventName: string,
    callback: (callbackParams: T) => void
  ) {
    if (!this._callbacks[eventName]) return;
    this._callbacks[eventName] = this._callbacks[eventName].filter(
      (registeredEvent) => registeredEvent !== callback
    );
  }

  public emit<T extends Object>(eventName: string, data: T) {
    if (!this._callbacks[eventName]) return;

    this._callbacks[eventName].forEach((event) => event(data));
  }
}

class EventEmitterMap {
  private events: Map<string, any> = new Map();

  constructor() {}

  on<T extends Object>(
    eventName: string,
    callback: (callbackParams: T) => void
  ) {
    const registeredEvent = this.events.get(eventName) ?? [];
    registeredEvent.push(callback);
    this.events[eventName] = registeredEvent;
  }

  emit<T extends Object>(eventName: string, data: T) {
    const targetEvent = this.events.get(eventName);
    if (!targetEvent) return;

    targetEvent.forEach((event) => event(data));
  }

  off(eventName) {
    if (this.events.get(eventName)) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}

// other method
// 특정 class 내에서 단일 이벤트만을 다룰때 사용하는 방식

type Handler<T> = (e: T) => void;
type RegisteredHandler<N extends string, E> = Map<N, Handler<E>[]>;

class Events<N extends string, E> {
  private e: E;
  private registeredHandler: RegisteredHandler<N, E> = new Map();

  constructor(e: E) {
    this.e = e;
  }

  public on(event: N, handler: Handler<E>) {
    const handlers = this.registeredHandler.get(event) ?? [];
    handlers.push(handler);
    this.registeredHandler.set(event, handlers);
  }

  public emit(event: N) {
    const handlers = this.registeredHandler.get(event) ?? [];
    handlers.forEach((handler) => handler(event));
  }

  public remove(event?: N) {
    if (event) {
      this.registeredHandler.delete(event);
    } else {
      this.registeredHandler.clear();
    }
  }
}
