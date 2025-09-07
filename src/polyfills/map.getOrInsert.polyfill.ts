declare global {
  interface Map<K, V> {
    getOrInsert(key: K, defaultValue: V): V;
    getOrInsertComputed(key: K, callback: (key: K) => V): V;
  }
}

if (!Map.prototype.getOrInsert) {
  Map.prototype.getOrInsert = function <K, V>(
    this: Map<K, V>,
    key: K,
    defaultValue: V
  ): V {
    if (!this.has(key)) {
      this.set(key, defaultValue);
    }
    return this.get(key) as V;
  };
}

if (!Map.prototype.getOrInsertComputed) {
  Map.prototype.getOrInsertComputed = function <K, V>(
    this: Map<K, V>,
    key: K,
    callback: (key: K) => V
  ): V {
    if (!this.has(key)) {
      this.set(key, callback(key));
    }
    return this.get(key) as V;
  };
}

export {}; // Prevents "ambient" modules, treats this file as a regular module.
