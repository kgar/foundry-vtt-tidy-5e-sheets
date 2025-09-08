/** 
 * Gets an entry from a map. If the entry doesn't exist, the value is inserted and then returned. 
 * This helper is temporary and is meant to be replaced by Map.prototype.getOrInsert. @see https://github.com/tc39/proposal-upsert
 */
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

/** 
 * Gets an entry from a map. If the entry doesn't exist, the value is inserted via a callback function and then returned. 
 * This helper is temporary and is meant to be replaced by Map.prototype.getOrInsert. @see https://github.com/tc39/proposal-upsert
 */
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
