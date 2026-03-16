export function queryStrict<T extends Element>(selector: string) {
  return (
    _: ClassAccessorDecoratorTarget<HTMLElement, T>
  ): ClassAccessorDecoratorResult<HTMLElement, T> => ({
    get(this: HTMLElement): T {
      const el = this.querySelector<T>(selector);
      if (el == null) {
        throw new Error(`'${selector}'를 찾을 수 없어요.`);
      }
      return el;
    },
  });
}

export function inject<T>(name: string) {
  return (
    _: ClassAccessorDecoratorTarget<HTMLElement, T>
  ): ClassAccessorDecoratorResult<HTMLElement, T> => {
    const store = new WeakMap<HTMLElement, T>();
    return {
      get(this: HTMLElement): T {
        const value = store.get(this);
        if (value == null) {
          throw new Error(`'${name}'가 주입되지 않았어요.`);
        }
        return value;
      },
      set(this: HTMLElement, value: T) {
        store.set(this, value);
      },
    };
  };
}
