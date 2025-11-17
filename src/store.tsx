import { trackStore } from "@solid-primitives/deep";
import { load, Store } from "@tauri-apps/plugin-store";
import {
  createContext,
  createEffect,
  JSX,
  onMount,
  useContext,
} from "solid-js";
import { createStore, SetStoreFunction, unwrap } from "solid-js/store";

type Settings = {
  theme: string;
  font: {
    family: string;
    size: number;
  };
};

const defaultSettings: Settings = {
  theme: "dark",
  font: { family: "SansSerif", size: 14 },
};

export const StoreContext = createContext<{
  settings: [Settings, SetStoreFunction<Settings>];
}>();

export const StoreProvider = (props: { children?: JSX.Element }) => {
  const [settings, setSettings] = createStore<Settings>(defaultSettings);
  let store: Store | null = null;

  // 初始化
  onMount(async () => {
    store = await load("store.json");
    setSettings((await store.get<Settings>("settings")) || defaultSettings);
  });

  // 设置发生变动时保存设置信息
  createEffect(() => {
    trackStore(settings);
    if (store) {
      store
        .set("settings", settings)
        .then(() => store!.save())
        .then(() => console.debug("Settings saved successfully!"))
        .catch((e) => console.error("Settings save failed:", e));
    }
  });

  // 切换主题
  createEffect(() => {
    const theme = settings.theme;
    const element = document.documentElement;
    element.setAttribute("data-theme", theme);
  });

  return (
    <StoreContext.Provider value={{ settings: [settings, setSettings] }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("Missing store context provider!");
  }
  return context!!.settings;
};
