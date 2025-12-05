import { trackStore } from "@solid-primitives/deep";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { load, Store } from "@tauri-apps/plugin-store";
import {
  createContext,
  createEffect,
  JSX,
  onMount,
  useContext,
} from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

///
/// 输入和输出布局
///
export type IOLayout = "horizontal" | "vertical";

//
// 编辑器自动换行类型
//
export type WordWrap = "off" | "on" | "wordWrapColumn" | "bounded";

//
// 设置类型
//
export type Settings = {
  // 通用配置
  common: {
    theme: string;
    openConfigCollapse: boolean;
    ioLayout: IOLayout;
  };
  // 编辑器配置
  editor: {
    wordWrap: WordWrap;
    font: {
      family: string;
      size: number;
    };
  };
  version: {
    app: string;
    tauri: string;
  };
};

const APP_VERSION = await getVersion();
const TAURI_VERSION = await getTauriVersion();

const defaultSettings: Settings = {
  common: { theme: "dark", openConfigCollapse: true, ioLayout: "horizontal" },
  editor: { wordWrap: "off", font: { family: "SansSerif", size: 14 } },
  version: {
    app: APP_VERSION,
    tauri: TAURI_VERSION,
  },
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
    const theme = settings.common.theme;
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
