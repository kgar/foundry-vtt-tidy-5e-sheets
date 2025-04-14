/**
 * A reactive primitive which provides a POJO wrapping around any type.
 *
 * The common use is to wrap a Foundry document class when passing to other components.
 */
export type Ref<T> = {
  value: T;
};
