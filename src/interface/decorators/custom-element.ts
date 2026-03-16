export function customElement(tagName: string) {
  return (Target: CustomElementConstructor, _: ClassDecoratorContext) => {
    customElements.define(tagName, Target);
  };
}
