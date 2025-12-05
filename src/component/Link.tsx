import { openUrl } from "@tauri-apps/plugin-opener";
import { twMerge } from "tailwind-merge";

export default function Link(props: {
  label: string;
  href: string;
  class?: string;
}) {
  return (
    <a
      class={twMerge("link link-primary text-sm font-bold", props.class)}
      onClick={() => openUrl(props.href)}
    >
      {props.label}
    </a>
  );
}
