import { createEffect, createSignal } from "solid-js";

export default function ThemeSwitch() {
  const _theme = localStorage.getItem("theme");
  const [theme, setTheme] = createSignal(_theme || "dark");
  createEffect(() => {
    document.documentElement.setAttribute("data-theme", theme());
    localStorage.setItem("theme", theme());
  });
  return (
    <select
      class="select select-sm w-30 outline-none"
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="light" selected={theme() === "light"}>
        Light
      </option>
      <option value="dark" selected={theme() === "dark"}>
        Dark
      </option>
    </select>
  );
}
