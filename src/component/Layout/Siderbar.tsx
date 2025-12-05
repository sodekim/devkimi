import { House, Settings } from "lucide-solid";
import Logo from "../Logo";
import Menu from "./Menu";
import { createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";
import { twMerge } from "tailwind-merge";

export default function Sidebar() {
  const pathname = createMemo(() => useLocation().pathname);
  return (
    <div class="drawer-side flex w-70 flex-col overflow-visible">
      {/* Logo */}
      <div class="flex h-12 w-full scale-65 items-center justify-start">
        <Logo />
      </div>

      {/* Sidebar Menu */}
      <label
        html-for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div class="flex w-full flex-1 flex-col items-start overflow-hidden">
        {/*所有工具*/}
        <ul class="menu border-base-300 w-full border-b">
          <li>
            <a class="flex gap-4" href="/home">
              <House size={14} color="var(--color-primary)" />
              所有工具
            </a>
          </li>
        </ul>

        {/*菜单树*/}
        <Menu />

        {/*所有工具*/}
        <ul class="menu border-base-300 w-full border-t">
          <li>
            <a class="flex gap-4" href="/settings">
              <Settings size={14} color="var(--color-primary)" />
              设置
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
