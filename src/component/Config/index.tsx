import { children, JSX } from "solid-js";
import Container from "../Container";
import { Input, NumberInput } from "./Input";
import Option from "./Option";
import Select from "./Select";
import Switch from "./Switch";
import { twMerge } from "tailwind-merge";
import { useSettings } from "../../store";

const Card = (props: { label?: string; collapse?: boolean, children?: JSX.Element }) => {
  const [settings] = useSettings();
  const _children = children(() => props.children);
  const _collapse = () => props.collapse ?? true;
  return (
    <div class={twMerge("collapse bg-base-100", _collapse() ? "collapse-arrow" : "collapse-open")}>
      <input type="checkbox" checked={settings.common.openConfigCollapse} />
      <div class="collapse-title font-semibold text-sm">{props.label || "配置"}</div>
      <div class=" collapse-content">
        <div class="flex flex-col items-center gap-2 rounded-md">
          {_children()}
        </div>
      </div>
    </div>
  );
};

const Config = {
  Option,
  Switch,
  Select,
  Input,
  NumberInput,
  Card,
};

export default Config;
