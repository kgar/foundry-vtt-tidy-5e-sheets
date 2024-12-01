declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:outsideclick'?: (event: any) => any;
    'on:longpress'?: (event: any) => any;
  }
}
