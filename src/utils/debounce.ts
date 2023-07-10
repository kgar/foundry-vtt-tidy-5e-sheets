export function debounce(func: (...args: any[]) => any, timeout = 300) {
  let timer: number;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout) as any as number;
  };
}
