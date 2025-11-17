import { Accessor } from "solid-js";

export function accessor<T>(accessor: MaybeAccessor<T>): Accessor<T> {
  if (typeof accessor === "function") {
    return accessor as () => T;
  }
  return () => accessor;
}

export type MaybeAccessor<T> = T | (() => T);
