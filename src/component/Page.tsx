import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Page(props: {
  children?: JSX.Element;
  class?: string;
}) {
  const _children = children(() => props.children);
  return (
    <div
      class={twMerge(
        "flex size-full flex-col gap-4 overflow-x-hidden overflow-y-auto",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
