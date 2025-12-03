import { useLocation } from "@solidjs/router";
import { EllipsisVertical } from "lucide-solid";
import { createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";
import { RouteMeta, routeMetas } from "../../routes";

export default function Menu() {
  const pathname = createMemo(() => useLocation().pathname);
  const menu = (meta: RouteMeta) => {
    const children = meta.children || [];
    if (children.length > 0) {
      let Icon = meta.icon || EllipsisVertical;
      const Submenu = () =>
        children
          .filter((child) => !child.hidden)
          .map((child) => {
            let ChildIcon = child.icon || Icon;
            const href = `${meta.path}${child.path}`;
            const active = () => href === pathname();
            return (
              <li>
                <a href={href} class="flex gap-4">
                  <ChildIcon size={14} color="var(--color-primary)" />
                  <span class="text-sm">{child.label}</span>
                </a>
              </li>
            );
          });
      return (
        <li>
          <details>
            <summary
              class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip={meta.label}
            >
              <button class="flex items-center justify-center gap-4">
                <Icon size={14} color="var(--color-primary)" />
                <span class="text-sm">{meta.label}</span>
              </button>
            </summary>
            <ul class="flex flex-col gap-1">
              <Submenu />
            </ul>
          </details>
        </li>
      );
    }
  };

  let Menu = () => routeMetas.filter((meta) => !meta.hidden).map(menu);

  return (
    <ul class="menu w-full grow flex-nowrap gap-1 overflow-y-auto">
      <Menu />
    </ul>
  );
}
