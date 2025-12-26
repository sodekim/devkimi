import { useSettings } from "@/store";
import { makePersisted } from "@solid-primitives/storage";
import { useLocation } from "@solidjs/router";
import { createStore } from "solid-js/store";

export function createCachableStore<T extends object = {}>(initialValue?: T) {
  const [settings] = useSettings();
  const store = createStore<T>(initialValue || ({} as T));
  if (settings.system.cachable) {
    const location = useLocation();
    const name = location.pathname;
    const storage = localStorage;
    return makePersisted(store, { name, storage });
  }
  return store;
}
