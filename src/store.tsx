import { trackStore } from "@solid-primitives/deep";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { load, Store } from "@tauri-apps/plugin-store";
import {
  createContext,
  createEffect,
  JSX,
  onMount,
  useContext,
} from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { showTray } from "./command/tray";

///
export type CloseBehavior = "quit" | "tray";

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
  // 系统配置
  system: {
    closeBehavior: CloseBehavior;
  };
  // 通用配置
  common: {
    theme: string;
    openConfigCollapse: boolean;
  };
  // 编辑器配置
  editor: {
    wordWrap: WordWrap;
    font: {
      family: string;
      size: number;
    };
  };
  // 调试配置
  debug: {
    level: string;
  };
};

const defaultSettings: Settings = {
  system: {
    closeBehavior: "quit",
  },
  common: { theme: "dark", openConfigCollapse: true },
  editor: { wordWrap: "off", font: { family: "SansSerif", size: 14 } },
  debug: { level: "info" },
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

    // 控制关闭行为
    const currentWindow = getCurrentWindow();
    currentWindow.onCloseRequested(async (event) => {
      if (settings.system.closeBehavior === "tray") {
        event.preventDefault();
        currentWindow.hide().then(() => showTray());
      }
    });
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
