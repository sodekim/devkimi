import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Flex(
  props: {
    children?: JSX.Element;
    class?: string;
    gap?: number;
    direction?: "horizontal" | "vertical";
  } & JSX.HTMLAttributes<HTMLDivElement>,
) {
  const [_props, attributes] = splitProps(props, [
    "children",
    "class",
    "gap",
    "direction",
  ]);
  return (
    <div
      class={twMerge(
        `flex items-center justify-center gap-${_props.gap ?? 2}`,
        (_props.direction ?? "horizontal") === "vertical"
          ? "flex-col"
          : "flex-row",
        _props.class,
      )}
    >
      {_props.children}
    </div>
  );
}
