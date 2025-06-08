const nilValues = [null, undefined] as const;
export function isNil(value: any, ...or: any[]): value is null | undefined {
  return nilValues.concat(or ?? []).includes(value);
}

function camelToLowerDashCase(str: string) {
  if (str != str.toLowerCase()) {
    str = str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  }
  return str;
}

export function buildDataset(obj: Record<string, unknown> | null | undefined) {
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
