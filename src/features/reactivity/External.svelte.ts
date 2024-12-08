/**
 * Provides coarse-grained reactivity to a type. This is useful for applying blanket reactivity to third-party classes like Actor5e.
 * This class is best used for `context`-like properties found in sheets, because the `data` property can be re-assigned to trigger
 * invalidation across the sheet.
 * 
 * @see
 * As seen on https://github.com/sveltejs/svelte/issues/10560#issuecomment-2057092046
 * 
 */
export class External<T> {
  #data;
  #version = $state(0);

  constructor(data: T) {
    this.#data = data;
  }
  get data() {
    this.#version;
    return this.#data;
  }
  set data(_data) {
    this.#version++;
    this.#data = _data;
  }
  invalidate() {
    this.#version++;
  }
}
