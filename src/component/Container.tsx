import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Container(props: {
  direction?: "row" | "column";
  children?: JSX.Element;
  class?: string;
}) {
  const _children = children(() => props.children);
  return (
    <div
      class={twMerge(
        "flex size-full gap-4 overflow-y-auto",
        (props.direction ?? "column") == "column" ? "flex-col" : "flex-row",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
