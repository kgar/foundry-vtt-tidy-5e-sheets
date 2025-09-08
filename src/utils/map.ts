export function mapGetOrInsert<K, V>(
  map: Map<K, V>,
  key: K,
  defaultValue: V
): V {
  if (!map.has(key)) {
    map.set(key, defaultValue);
  }
  return map.get(key) as V;
}

export function getOrInsertComputed<K, V>(
  map: Map<K, V>,
  key: K,
  callback: (key: K) => V
): V {
  if (!map.has(key)) {
    map.set(key, callback(key));
  }
  return map.get(key) as V;
}
