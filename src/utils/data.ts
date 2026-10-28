export function isNil(value: any, ...or: any[]): value is null | undefined {
  if (value === null || value === undefined) {
    return true;
  }

  return or.includes(value);
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
    {},
  );
}

export function removeEmptyProperties<T extends Record<string, any>>(
  obj: T,
): T {
  const cleanEntries = Object.entries(obj)
    .map(([key, value]) => {
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        return [key, removeEmptyProperties(value)];
      }
      return [key, value];
    })
    .filter(([_, value]) => {
      if (value === null || value === undefined || value === '') {
        return false;
      }

      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      if (
        value &&
        typeof value === 'object' &&
        Object.keys(value).length === 0
      ) {
        return false;
      }

      return true;
    });

  return Object.fromEntries(cleanEntries) as T;
}
