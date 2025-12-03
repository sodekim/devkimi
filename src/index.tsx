/* @refresh reload */
import "solid-devtools";
import { render } from "solid-js/web";
import "./index.css";

import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

// 禁用快捷键
// document.addEventListener("keydown", (event) => {
//   const disabledShortcuts =
//     ["F5", "F7"].includes(event.key) ||
//     (event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) ||
//     ((event.ctrlKey || event.metaKey) &&
//       ["F", "G", "H", "J", "P", "Q", "R", "U"].includes(
//         event.key.toUpperCase(),
//       ));
//   console.log("Disabled shortcut:", disabledShortcuts);
//   if (disabledShortcuts) {
//     event.preventDefault();
//   }
// });

// 禁用右键菜单
// document.addEventListener("contextmenu", (event) => {
//   event.preventDefault();
// });

render(() => <App />, root!);
