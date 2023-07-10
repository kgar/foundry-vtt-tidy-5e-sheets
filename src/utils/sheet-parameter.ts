/**
 * Utility class which allows for passing an object reference of a primitive type 
 * (string, number, boolean, etc.) down to a svelte component and allowing the component 
 * to make changes to the primitive which will carry over to subsequent rerenders 
 * of the svelte component.
 * 
 * Sample usages: 
 * - remembering the last selected tab between rerenders
 */
export class SheetParameter<T> {
  constructor(private value: T) {}

  get() {
    return this.value;
  }

  set(value: T) {
    this.value = value;
  }
}
