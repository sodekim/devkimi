import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Flex(props: {
  children?: JSX.Element;
  class?: string;
  gap?: number;
  direction?: "horizontal" | "vertical";
}) {
  const _children = children(() => props.children);
  return (
    <div
      class={twMerge(
        "flex items-center justify-center",
        (props.direction ?? "horizontal") === "vertical"
          ? "flex-col"
          : "flex-row",
        props.gap ? `gap-${props.gap}` : "",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
