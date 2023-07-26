const nilValues = [null, undefined];
export function isNil(x: any, ...or: any[]) {
  return nilValues.concat(or ?? []).includes(x);
}
