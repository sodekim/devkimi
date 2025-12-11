/* @refresh reload */
import "solid-devtools";
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { showTray } from "./command/tray";

// 禁用快捷键;
document.addEventListener("keydown", (event) => {
  const disabledShortcuts =
    ["F5", "F7"].includes(event.key) ||
    (event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) ||
    ((event.ctrlKey || event.metaKey) &&
      ["F", "G", "H", "J", "P", "Q", "R", "U"].includes(
        event.key.toUpperCase(),
      ));
  if (disabledShortcuts) {
    event.preventDefault();
  }
});

// 禁用右键菜单;
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// 开始渲染界面
const root = document.getElementById("root");
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}
render(() => <App />, root!);
