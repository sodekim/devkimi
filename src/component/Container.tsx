import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Container(props: {
  children?: JSX.Element;
  class?: string;
}) {
  const _children = children(() => props.children);
  return (
    <div
      class={twMerge(
        "flex size-full flex-col gap-4 overflow-y-auto",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
