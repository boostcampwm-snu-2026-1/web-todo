function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

function isResponse(
  value: unknown
): value is { state: string; data?: unknown; detailedError?: unknown } {
  return value !== null && typeof value === 'object' && 'state' in value;
}

export function dispatch(eventName: string) {
  return function <This extends HTMLElement, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    _: ClassMethodDecoratorContext
  ): (this: This, ...args: Args) => Return {
    if (!isFunction(target)) {
      throw new Error(`@dispatch: 메서드에만 사용할 수 있어요.`);
    }

    return function (this: HTMLElement, ...args: unknown[]) {
      const response = target.apply(this, args);

      const handle = (result: unknown) => {
        if (isResponse(result) && result.state === 'success') {
          this.dispatchEvent(
            new CustomEvent(eventName, {
              detail: result.data,
              bubbles: true,
              composed: true,
            })
          );
        }
        return result;
      };

      if (response instanceof Promise) {
        return response.then(handle) as Return;
      }

      return handle(response) as Return;
    };
  };
}

export function errorDispatch(eventName: string) {
  return <This extends HTMLElement, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    _: ClassMethodDecoratorContext
  ): ((this: This, ...args: Args) => Return) => {
    if (!isFunction(target)) {
      throw new Error(`@errorDispatch: 메서드에만 사용할 수 있어요.`);
    }
    return function (this: This, ...args: Args): Return {
      const response = target.apply(this, args);

      const handle = (result: unknown) => {
        if (isResponse(result) && result.state === 'error') {
          this.dispatchEvent(
            new CustomEvent(eventName, {
              detail: { error: result.detailedError },
              bubbles: true,
              composed: true,
            })
          );
        }
        return result;
      };

      if (response instanceof Promise) {
        return response.then(handle) as Return;
      }

      return handle(response) as Return;
    };
  };
}
