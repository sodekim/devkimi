import { openUrl } from "@tauri-apps/plugin-opener";
import { twMerge } from "tailwind-merge";

export default function Link(props: {
  label: string;
  onClick?: () => void;
  href?: string;
  class?: string;
}) {
  return (
    <a
      class={twMerge("link link-primary text-sm font-bold", props.class)}
      onClick={() => {
        if (props.href) {
          openUrl(props.href);
        } else if (props.onClick) {
          props.onClick();
        }
      }}
    >
      {props.label}
    </a>
  );
}
