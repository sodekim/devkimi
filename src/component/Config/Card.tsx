import { children, JSX } from "solid-js";
import { useSettings } from "../../store";
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
        "bg-base-100 collapse",
        _collapse() ? "collapse-arrow" : "collapse-open",
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
