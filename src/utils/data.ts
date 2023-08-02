const nilValues = [null, undefined] as const;
export function isNil(x: any, ...or: any[]) {
  return nilValues.concat(or ?? []).includes(x);
}

function camelToLowerDashCase(str: string) {
  if (str != str.toLowerCase()) {
    str = str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  }
  return str;
}

export function buildDataset(obj: Record<string, unknown> | null) {
  if (!obj) {
    return {};
  }

  return Object.entries(obj).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      acc[`data-${camelToLowerDashCase(key)}`] = value;
      return acc;
    },
    {}
  );
}
