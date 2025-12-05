import { useSettings } from "@/store";
import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

const Card = (props: {
  label?: string;
  collapse?: boolean;
  children?: JSX.Element;
}) => {
  const [settings] = useSettings();
  const _children = children(() => props.children);
  const _collapse = () => props.collapse ?? true;
  return (
    <div
      class={twMerge(
        "from-base-100/95 to-base-100/80 border-base-content/10 collapse rounded-md border bg-linear-to-br backdrop-blur-sm",
        _collapse() ? "collapse-arrow" : "collapse-open overflow-visible",
      )}
    >
      <input type="checkbox" checked={settings.common.openConfigCollapse} />
      <div class="collapse-title gap-2 text-sm font-semibold">
        {props.label || "配置"}
      </div>
      <div class="collapse-content">
        <div class="flex flex-col items-center gap-2 rounded-md">
          {_children()}
        </div>
      </div>
    </div>
  );
};

export default Card;
