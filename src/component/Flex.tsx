import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Flex(props: {
  children?: JSX.Element;
  class?: string;
  gap?: number;
  direction?: "horizontal" | "vertical";
}) {
  const _children = children(() => props.children);
  const _gap = () => props.gap ?? 2;
  return (
    <div
      class={twMerge(
        `flex items-center justify-center gap-${_gap()}`,
        (props.direction ?? "horizontal") === "vertical"
          ? "flex-col"
          : "flex-row",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
