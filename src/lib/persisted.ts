import { makePersisted } from "@solid-primitives/storage";
import { useLocation } from "@solidjs/router";
import { createStore } from "solid-js/store";

export function createPageStore<T extends object = {}>(initialValue?: T) {
  const location = useLocation();
  const name = location.pathname;
  const storage = localStorage;
  if (initialValue !== undefined) {
    return makePersisted(createStore<T>(initialValue), {
      name,
      storage,
    });
  } else {
    return makePersisted(createStore<T>({} as T), {
      name,
      storage,
    });
  }
}
